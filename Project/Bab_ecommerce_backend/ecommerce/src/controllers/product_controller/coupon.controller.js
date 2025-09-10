const db = require("../../../config/config");
const Coupon = db.coupon;

const response = (res, status, success, message, data = null) => {
  return res.status(status).json({ status: success, message, data });
};

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue = 0,
      maxDiscount = null,
      usageLimit = 1,
      usagePerUser = 1,
      startDate,
      endDate,
      status = "active",
      sellerId = null, // optional, if seller is creating
      appliedOnType,
      appliedOnId,
      createdByAdmin,
    } = req.body;

    // ✅ Required fields check
    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return response(res, 400, false, "Required fields are missing");
    }

    // ✅ Enum validation
    if (!["percent", "amount"].includes(discountType)) {
      return response(res, 400, false, "Invalid discount type");
    }

    if (!["active", "inactive"].includes(status)) {
      return response(res, 400, false, "Invalid coupon status");
    }

    // ✅ Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return response(res, 400, false, "End date must be after start date");
    }

    // ✅ Redundancy check
    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      return response(res, 409, false, "Coupon code already exists");
    }

    // ✅ Create coupon
    const newCoupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      usagePerUser,
      startDate: start,
      endDate: end,
      status,
      sellerId,
      appliedOnType,
      appliedOnId,
      createdByAdmin,
    });

    return response(res, 201, true, "Coupon created successfully", newCoupon);
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return response(res, 500, false, "Server error");
  }
};

// ✅ Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, sellerId, status } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};

    if (sellerId) {
      whereClause.sellerId = sellerId;
    }

    if (status && ["active", "inactive", "expired"].includes(status)) {
      whereClause.status = status;
    }

    const { count, rows } = await Coupon.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return response(res, 200, true, "Coupons fetched", {
      totalCoupons: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error("Fetch Coupons Error:", error);
    return response(res, 500, false, "Server error");
  }
};
// ✅ Get Coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return response(res, 404, false, "Coupon not found");

    return response(res, 200, true, "Coupon fetched", coupon);
  } catch (error) {
    console.error("Get Coupon Error:", error);
    return response(res, 500, false, "Server error");
  }
};

// ✅ Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return response(res, 404, false, "Coupon not found");

    const { code } = req.body;
    if (code && code !== coupon.code) {
      const existing = await Coupon.findOne({ where: { code } });
      if (existing) {
        return response(
          res,
          409,
          false,
          "Another coupon with same code exists"
        );
      }
    }

    await coupon.update(req.body);
    return response(res, 200, true, "Coupon updated", coupon);
  } catch (error) {
    console.error("Update Coupon Error:", error);
    return response(res, 500, false, "Server error");
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });

    if (!deleted) return response(res, 404, false, "Coupon not found");

    return response(res, 200, true, "Coupon deleted");
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return response(res, 500, false, "Server error");
  }
};

// controllers/couponController.js
exports.applyCoupon = async (req, res) => {
  try {
    const { code, userId, cartItems = [], totalAmount } = req.body;

    // 1. Basic validation
    if (!code || !userId || !cartItems.length || !totalAmount) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    // 2. Check if coupon exists & active
    const coupon = await db.coupon.findOne({
      where: { code, status: "active" },
    });

    if (!coupon) {
      return res.status(404).json({
        status: false,
        message: "Invalid or expired coupon",
      });
    }

    const now = new Date();

    // 3. Date range check
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return res.status(400).json({
        status: false,
        message: "Coupon not valid currently",
      });
    }

    // 4. Minimum order value check
    if (parseFloat(totalAmount) < parseFloat(coupon.minOrderValue)) {
      return res.status(400).json({
        status: false,
        message: `Minimum order value should be ₹${coupon.minOrderValue}`,
      });
    }

    // 5. Usage limits
    const totalUsage = await db.couponusage.count({
      where: { couponId: coupon.id },
    });

    if (totalUsage >= coupon.usageLimit) {
      return res.status(400).json({
        status: false,
        message: "Coupon usage limit exceeded",
      });
    }

    const userUsage = await db.couponusage.findOne({
      where: { couponId: coupon.id, userId },
    });

    if (userUsage && userUsage.usageCount >= coupon.usagePerUser) {
      return res.status(400).json({
        status: false,
        message: "You have already used this coupon",
      });
    }

    // 6. Coupon applicability check
    let eligibleAmount = 0;

    switch (coupon.appliedOnType) {
      case "product": {
        const item = cartItems.find((i) => i.productId === coupon.appliedOnId);
        if (item) eligibleAmount = item.price * item.quantity;
        break;
      }
      case "subCategory": {
        const items = cartItems.filter(
          (i) => i.subCategoryId === coupon.appliedOnId
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        break;
      }
      case "category": {
        const items = cartItems.filter(
          (i) => i.categoryId === coupon.appliedOnId
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        break;
      }
      case "mainCategory": {
        const items = cartItems.filter(
          (i) => i.mainCategoryId === coupon.appliedOnId
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        break;
      }
      case "all": {
        eligibleAmount = totalAmount; // Global coupon
        break;
      }
      default:
        eligibleAmount = 0;
    }

    if (eligibleAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Coupon not applicable on selected items",
      });
    }

    // 7. Discount calculation
    let discount = 0;

    if (coupon.discountType === "percent") {
      discount = (eligibleAmount * parseFloat(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, parseFloat(coupon.maxDiscount));
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }

    const finalAmount = Math.max(totalAmount - discount, 0).toFixed(2);

    // ✅ Response
    return res.status(200).json({
      status: true,
      message: "Coupon applied successfully",
      discount: discount.toFixed(2),
      finalAmount,
      couponId: coupon.id,
      appliedOnType: coupon.appliedOnType,
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
