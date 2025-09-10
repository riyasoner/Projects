const db = require("../../../config/config");
const User = db.user;

const updateProfile = async (req, res) => {
  try {
    const userId = req.query.userId; // Or req.user.id if using JWT middleware
    const {
      fullName,
      email,
      phoneNo,
    } = req.body;

    // Fetch the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.phoneNo = phoneNo || user.phoneNo;

    // Handle profile image update
    if (req.file) {
      const profileImagePath = `profileImage/${req.file.filename}`;
      user.profileImage = profileImagePath;
    }

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully.",
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  updateProfile,
};
