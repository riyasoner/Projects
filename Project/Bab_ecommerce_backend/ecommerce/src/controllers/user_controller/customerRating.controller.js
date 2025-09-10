const db = require("../../../config/config");
const CustomerRating = db.customerRating;
const User = db.user;
const { Op } = require("sequelize");

// Create a new rating
exports.createRating = async (req, res) => {
  try {
    const { userId, rating, review } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({
        status: false,
        message: "userId and rating are required",
      });
    }

    // ✅ Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found with the given userId",
      });
    }

    // Create rating
    const newRating = await CustomerRating.create({ userId, rating, review });

    res.status(201).json({
      status: true,
      message: "Thank you! Your rating has been submitted.",
      data: newRating,
    });
  } catch (error) {
    console.error("Create Rating Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while submitting rating",
      error: error.message,
    });
  }
};

// Admin approves a rating
exports.approveRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const rating = await CustomerRating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({
        status: false,
        message: "Rating not found",
      });
    }

    rating.isApproved = true;
    await rating.save();

    res.status(200).json({
      status: true,
      message: "Rating approved successfully",
    });
  } catch (error) {
    console.error("Approve Rating Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while approving rating",
      error: error.message,
    });
  }
};

// Get all approved ratings (for UI display)
exports.getApprovedRatings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const offset = (page - 1) * limit;

    const { count, rows: ratings } = await CustomerRating.findAndCountAll({
      where: { isApproved: true },
      include: [
        {
          model: User,
          as: "user", // Use the alias you defined in association
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      status: true,
      message: "Approved ratings fetched successfully",
      data: ratings,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Fetch Ratings Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while fetching ratings",
      error: error.message,
    });
  }
};
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await CustomerRating.findByPk(id);

    if (!rating) {
      return res.status(404).json({
        status: false,
        message: "Rating not found",
      });
    }

    await rating.destroy();

    res.status(200).json({
      status: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("Delete Rating Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while deleting rating",
      error: error.message,
    });
  }
};
exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, isApproved } = req.body;

    const existingRating = await CustomerRating.findByPk(id);

    if (!existingRating) {
      return res.status(404).json({
        status: false,
        message: "Rating not found",
      });
    }

    await existingRating.update({ rating, review, isApproved });

    res.status(200).json({
      status: true,
      message: "Rating updated successfully",
      data: existingRating,
    });
  } catch (error) {
    console.error("Update Rating Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while updating rating",
      error: error.message,
    });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await CustomerRating.findOne({
      where: { id },
      include: {
        model: User,
        as: "user", // Use the alias you defined in association

        attributes: ["id", "fullName", "email"],
      },
    });

    if (!rating) {
      return res.status(404).json({
        status: false,
        message: "Rating not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Rating fetched successfully",
      data: rating,
    });
  } catch (error) {
    console.error("Get Rating Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while fetching rating",
      error: error.message,
    });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    let { page = 1, limit = 10, rating, isApproved } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (rating) {
      whereClause.rating = rating;
    }
    if (isApproved !== undefined) {
      whereClause.isApproved = isApproved === "true"; // Converts string to boolean
    }

    const { count, rows: ratings } = await CustomerRating.findAndCountAll({
      where: whereClause,
      include: {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      status: true,
      message: "Ratings fetched successfully",
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: ratings,
    });
  } catch (error) {
    console.error("Fetch Ratings Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error while fetching ratings",
      error: error.message,
    });
  }
};
