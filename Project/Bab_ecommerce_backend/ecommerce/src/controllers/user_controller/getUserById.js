// path: src/controllers/user_controller/user.controller.js

const db = require("../../../config/config");
const User = db.user;

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID excluding sensitive fields
    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          "password",
          "refreshTokenExpiration",
          "resetTokenExpiry",
          "refreshToken",
          "resetToken",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const userData = user.toJSON();

    // Convert profileImage to full URL if it exists
    if (userData.profileImage) {
      userData.profileImage = userData.profileImage.startsWith("/")
        ? `${baseUrl}${userData.profileImage}`
        : `${baseUrl}/${userData.profileImage}`;
    }

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserById,
};
