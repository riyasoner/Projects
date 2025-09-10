// path: src/controllers/user_controller/user.controller.js

const db = require("../../../config/config");
const User = db.user;
const { Op } = db.Sequelize;

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    // Search and role filters
    const whereCondition = {
      userType: { [Op.ne]: "admin" },
    };

    if (role) {
      whereCondition.userType = role;
    }

    if (search) {
      whereCondition[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Total user count for pagination
    const totalUsers = await User.count({ where: whereCondition });

    // Paginated result
    const users = await User.findAll({
      where: whereCondition,
      attributes: {
        exclude: [
          "password",
          "refreshToken",
          "refreshTokenExpiration",
          "resetToken",
          "resetTokenExpiry",
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Format profile image URLs
    const updatedUsers = users.map((user) => {
      const jsonUser = user.toJSON();
      if (jsonUser.profileImage) {
        jsonUser.profileImage = `${hostUrl}/${jsonUser.profileImage}`;
      }
      return jsonUser;
    });

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: updatedUsers,
      pagination: {
        total: totalUsers,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
};
