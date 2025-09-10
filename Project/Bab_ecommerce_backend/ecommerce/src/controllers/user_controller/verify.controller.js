// path: controllers/userController.js

const db = require("../../../config/config");
const User = db.user;

exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Update isVerified to true
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      status: true,
      message: "User verified successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
