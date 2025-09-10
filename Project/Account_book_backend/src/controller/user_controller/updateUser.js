const bcrypt = require("bcryptjs");
const db = require("../../../config/config");
const User = db.user;
const updateUser = async (req, res) => {
  try {
    const { id, name, email_id, phone_no, user_type, show_password } =
      req.body.editUser;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "User ID is required",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const updates = {
      name,
      email_id,
      phone_no,
      user_type,
      show_password,
    };

    if (show_password) {
      // Encrypt password before saving
      updates.password = await bcrypt.hash(show_password, 10);
    }

    await User.update(updates, { where: { id } });

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("edit_user error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { updateUser };
