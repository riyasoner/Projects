const bcrypt = require("bcrypt");
const db = require("../../../config/config");
const User = db.user;

const changePassword = async (req, res) => {
  try {
    const userId = req.query.userId; 
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Old password and new password are required.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Old password is incorrect.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  changePassword,
};
