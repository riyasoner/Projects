// path: src/controllers/user_controller/user.controller.js

const db = require("../../../config/config");
const User = db.user;

// DELETE User by ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Delete user
    await user.destroy();

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  deleteUserById, // ✅ export here
};
