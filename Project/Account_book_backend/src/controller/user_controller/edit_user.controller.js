// controllers/userController.js
const { Op, where } = require("sequelize");
const db = require("../../../config/config");

const User = db.user;

const edit_user = async (req, res) => {
  try {
    const {
      id,
      device_id,
      name,
      current_password,
      new_password,
      confirm_new_password,
    } = req.body;

    const check_user = await User.findByPk(id);
    if (!check_user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const check_login_from = check_user.login_from;

    // Check if id and device_id are provided
    if (check_login_from !== "web")
      if (!id || !device_id) {
        return res.status(400).json({
          status: false,
          message: "id and device_id are required",
        });
      }

    // Find user by ID
    const find_user = await User.findByPk(id);
    if (!find_user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    // If passwords are being updated, perform validations
    if (current_password || new_password || confirm_new_password) {
      const bcrypt = require("bcryptjs");

      // Validate current password
      const isPasswordValid = await bcrypt.compare(
        current_password,
        find_user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          status: false,
          message: "Current password is incorrect",
        });
      }

      // Validate new password and confirm new password
      if (new_password !== confirm_new_password) {
        return res.status(400).json({
          status: false,
          message: "New password and confirm new password do not match",
        });
      }

      // Hash the new password and update it
      const hashedPassword = await bcrypt.hash(new_password, 10);
      req.body.password = hashedPassword;
      req.body.show_password = new_password;
    }

    // Update user details
    const updateUser = await User.update(req.body, {
      where: { id: id },
    });

    if (!updateUser) {
      return res.status(500).json({
        status: false,
        message: "Data could not be updated",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User data updated successfully",
    });
  } catch (error) {
    console.error("Error in edit_user:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the data.",
    });
  }
};

// Update Any details
const update_user_details = async (req, res) => {
  try {
    const { id, ...updateFields } = req.body;

    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "User ID is required",
      });
    }

    // Find user by ID
    const find_user = await User.findByPk(id);
    if (!find_user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    // Update user details with provided fields
    const [rowsUpdated] = await User.update(updateFields, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      return res.status(400).json({
        status: false,
        message: "No changes were made to the user data",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User data updated successfully",
      data: {
        id: find_user.id,
        name: find_user.name,
        ...updateFields, // Include only updated fields
      },
    });
  } catch (error) {
    console.error("Error in edit_user:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const view_user = async (req, res) => {
  try {
    const { id } = req.query;
    const whereCondition = {};

    if (id) {
      whereCondition.id = { [Op.eq]: id };
    }
    const totalUsers = await User.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "name",
        "phone_no",
        "email_id",
        "login_from",
        "show_password",
      ],
    });
    if (totalUsers) {
      return res.status(200).json({
        status: true,
        message: "user retrieve Successfully",
        data: totalUsers,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "User not found ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  edit_user,
  view_user,
  update_user_details,
};
