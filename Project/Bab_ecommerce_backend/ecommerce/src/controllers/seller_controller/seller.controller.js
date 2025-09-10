const db = require("../../../config/config");
const sellerProfile = db.sellerProfile;
const User = db.user;
const { Op } = db.Sequelize;
const { Sequelize } = require("sequelize");
const Product = db.product;
const Order = db.order;
const OrderItem = db.orderitem;
const Seller = db.sellerProfile;
const fs = require("fs");
const path = require("path");
const SellerProfile = db.sellerProfile;

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status: status < 400,
    message,
    data,
  });
};

// Create Seller Profile
exports.createSellerProfile = async (req, res) => {
  try {
    // 1. Required field validation
    const requiredFields = ["storeName", "pickupAddress", "userId"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return sendResponse(res, 400, `${field} is required.`);
      }
    }

    // 2. Check if profile already exists
    const existingProfile = await sellerProfile.findOne({
      where: {
        userId: req.body.userId,
        status: { [db.Sequelize.Op.not]: "rejected" }, // ignore rejected profiles
      },
    });

    if (existingProfile) {
      if (existingProfile.status === "pending") {
        return sendResponse(
          res,
          400,
          "Your seller application is still pending."
        );
      } else if (existingProfile.status === "approved") {
        return sendResponse(res, 400, "You are already an approved seller.");
      }
    }
    // 3. Handle multiple businessDocs
    const docPaths =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/businessDocs/${file.filename}`)
        : [];

    // 4. Build profile data
    const profileData = {
      userId: req.body.userId,
      storeName: req.body.storeName,
      storeDescription: req.body.storeDescription || null,
      gstNumber: req.body.gstNumber || null,
      panNumber: req.body.panNumber || null,
      businessType: req.body.businessType || "Individual",
      bankAccountNumber: req.body.bankAccountNumber || null,
      bankIFSC: req.body.bankIFSC || null,
      pickupAddress: req.body.pickupAddress,
      businessDocs: docPaths,
    };

    // 5. Create the profile
    const newProfile = await sellerProfile.create(profileData);
    const user = await User.findByPk(req.body.userId);
    if (user) {
      user.userType = "seller";
      user.isApproved = false;
      await user.save();
    }

    return sendResponse(
      res,
      201,
      "Seller profile created successfully.",
      newProfile
    );
  } catch (error) {
    console.error("Error in createSellerProfile:", error);
    return sendResponse(
      res,
      500,
      "An unexpected error occurred while creating seller profile."
    );
  }
};

// Get Current Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const profile = await sellerProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return sendResponse(res, 404, "Seller profile not found.");
    }

    return sendResponse(
      res,
      200,
      "Seller profile fetched successfully.",
      profile
    );
  } catch (error) {
    console.error("Error in getSellerProfile:", error);
    return sendResponse(
      res,
      500,
      "An error occurred while fetching the seller profile."
    );
  }
};

// Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const profile = await sellerProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return sendResponse(res, 404, "Seller profile not found.");
    }

    const updatableFields = [
      "storeName",
      "storeDescription",
      "gstNumber",
      "panNumber",
      "businessType",
      "bankAccountNumber",
      "bankIFSC",
      "pickupAddress",
      "businessDocs",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    return sendResponse(
      res,
      200,
      "Seller profile updated successfully.",
      profile
    );
  } catch (error) {
    console.error("Error in updateSellerProfile:", error);
    return sendResponse(
      res,
      500,
      "An error occurred while updating the seller profile."
    );
  }
};

// Admin: Approve or Reject Seller
exports.approveSeller = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { status, rejectionReason } = req.body;

    // 1. Validate status
    if (!["approved", "rejected"].includes(status)) {
      return sendResponse(
        res,
        400,
        "Status must be either 'approved' or 'rejected'."
      );
    }

    // 2. Fetch seller profile
    const profile = await sellerProfile.findByPk(profileId);
    if (!profile) {
      return sendResponse(res, 404, "Seller profile not found.");
    }

    // 3. Update profile fields
    profile.status = status;
    profile.approvedAt = status === "approved" ? new Date() : null;
    profile.rejectionReason =
      status === "rejected" ? rejectionReason || "No reason provided" : null;

    await profile.save();

    // 4. Update user table
    const user = await User.findByPk(profile.userId);
    if (user) {
      if (status === "approved") {
        user.userType = "seller";
        user.isApproved = true;
        await user.save();
      } else {
        // rejected → reset user type and delete seller profile
        user.userType = "user";
        user.isApproved = false;
        await user.save();

        // await sellerProfile.destroy({
        //   where: { id: profileId },
        // });
      }
    }

    return sendResponse(
      res,
      200,
      `Seller profile ${status} successfully.`,
      status === "approved" ? profile : null
    );
  } catch (error) {
    console.error("Error in approveSeller:", error);
    return sendResponse(
      res,
      500,
      "An error occurred while approving/rejecting the seller."
    );
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const sellers = await User.findAndCountAll({
      where: {
        userType: "seller",
        fullName: { [Op.like]: `%${search}%` },
      },
      include: [
        {
          model: Seller, // store info
          as: "sellerInfo",
          attributes: ["storeName", "status", "id"],
        },
      ],
      attributes: ["id", "fullName", "email"],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    // For each seller, get product count and revenue
    const dataWithStats = await Promise.all(
      sellers.rows.map(async (seller) => {
        const productCount = await Product.count({
          where: { sellerId: seller.id },
        });

        const orders = await Order.findAll({
          include: [
            {
              model: OrderItem,
              as: "items",
              required: true,
              include: [
                {
                  model: Product,
                  as: "product",
                  where: { sellerId: seller.id },
                  attributes: [],
                  required: true,
                },
              ],
            },
          ],
          where: {
            orderStatus: { [Op.ne]: "cancelled" },
            paymentStatus: "paid",
          },
        });

        const totalRevenue = orders.reduce(
          (acc, ord) => acc + parseFloat(ord.totalAmount),
          0
        );

        return {
          ...seller.toJSON(),
          storeInfo: seller.sellerInfo || {},
          productCount,
          totalRevenue: totalRevenue.toFixed(2),
        };
      })
    );

    return res.status(200).json({
      message: "Sellers fetched successfully",
      status: true,
      totalSellers: sellers.count,
      totalPages: Math.ceil(sellers.count / limit),
      currentPage: parseInt(page),
      data: dataWithStats,
    });
  } catch (error) {
    console.error("Get All Sellers Error:", error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
    });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findOne({
      where: { id: sellerId, userType: "seller" },
      include: [
        {
          model: Seller,
          as: "sellerInfo",
        },
      ],
    });

    if (!seller) {
      return res.status(404).json({
        status: false,
        message: "Seller not found",
      });
    }

    // ✅ Remove sensitive fields like password before sending
    const sellerData = seller.toJSON();
    delete sellerData.password;
    delete sellerData.refreshToken;
    delete sellerData.refreshTokenExpiration;
    delete sellerData.resetToken;
    delete sellerData.resetTokenExpiry;
    delete sellerData.otp;

    // ✅ Attach full URL to profileImage if exists
    if (sellerData.profileImage) {
      const hostPrefix = `${req.protocol}://${req.get("host")}`;
      sellerData.profileImage = `${hostPrefix}/${sellerData.profileImage}`;
    }

    // ✅ Parse and convert businessDocs to full URL
    if (sellerData.sellerInfo?.businessDocs) {
      try {
        const docsArray = JSON.parse(sellerData.sellerInfo.businessDocs);
        const hostPrefix = `${req.protocol}://${req.get("host")}`;
        sellerData.sellerInfo.businessDocs = docsArray.map(
          (doc) => `${hostPrefix}${doc.startsWith("/") ? "" : "/"}${doc}`
        );
      } catch (err) {
        console.error("Failed to parse businessDocs:", err);
        sellerData.sellerInfo.businessDocs = [];
      }
    }

    return res.status(200).json({
      status: true,
      message: "Seller details fetched successfully",
      data: sellerData,
    });
  } catch (error) {
    console.error("Get Seller By ID Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

// DELETE Seller and their profile
exports.deleteSellerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find the seller (user)
    const seller = await User.findByPk(id);

    if (!seller) {
      return res.status(404).json({
        status: false,
        message: "Seller not found",
      });
    }

    // Step 3: Delete sellerProfile
    await SellerProfile.destroy({
      where: { userId: id },
    });

    // Step 4: Delete seller (user)
    await seller.destroy();

    return res.status(200).json({
      status: true,
      message: "Seller and their profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Seller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
