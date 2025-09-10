// controllers/userController.js
const db = require("../../../config/db.config");

const  User  = db.User; 
const bcrypt = require('bcrypt');

exports.resetPasswordController = async (req, res) => {
    try {
      const { user_id, password } = req.body;
      

      // Validate request data
      if (!user_id || !password || password.length < 6) {
        return res.status(400).json({
          status: false,
          message: 'Please provide a valid user ID and a password with a minimum length of 6 characters.',
        });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Update user password
      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { id: user_id } }
      );

      if (updatedUser[0] !== 0) {
        return res.status(200).json({
          status: true,
          message: 'Password changed successfully.',
        });
      } else {
        return res.status(404).json({
          status: false,
          message: 'User ID not found.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong.',
      });
    }
  }


