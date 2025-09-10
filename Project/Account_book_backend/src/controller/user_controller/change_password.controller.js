// controllers/userController.js
const db = require("../../../config/config");

const user = db.user;
const bcrypt = require("bcrypt");
// const { decoded_token } = require("../../utils/decode_access_token");

const changePassword = async (req, res) => {
  const { user_id, current_password, new_password, confirm_new_password } =
    req.body;

  try {
    // // Decode token and get user data
    // const user_data = await decoded_token(req);
    // const user_id = user_data.id;

    const findUser = await user.findOne({
      where: {
        id: user_id,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: false,
        message: "User not found or user not verified",
      });
    }

    const find_pass = findUser.password;

    // Compare the current_password with the stored hashed password
    const isMatch = await bcrypt.compare(current_password, find_pass);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Current password and stored password do not match",
      });
    }

    if (new_password !== confirm_new_password) {
      return res.status(400).json({
        status: false,
        message: "New password and retyped new password do not match",
      });
    }

    // Hash the new password before saving
    findUser.password = await bcrypt.hash(new_password, 10);
    findUser.show_password = new_password; // optional

    await findUser.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  changePassword,
};
