const db = require("../../../config/config");
const User = db.user;
const bcrypt = require("bcryptjs");
const cryptoHelper = require("../../utils/cryptoHelper");
const { hashValue } = cryptoHelper;

const tokenProcess = require("../../services/genrateToken");
const { Op } = require("sequelize");

const login = async (req, res) => {
  const { phone_no, password, device_token, login_from } = req.body;
  // identifier = phone or email
  const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const trimmedIdentifier = phone_no?.trim();
  const trimmedPassword = password?.trim();

  if (!trimmedIdentifier || !trimmedPassword) {
    return res.status(400).json({
      status: false,
      message: "Please provide email/phone and password.",
    });
  }

  if (!device_token && login_from !== "web") {
    return res.status(400).json({
      status: false,
      message: "Device token is required for app login.",
    });
  }

  try {
    const identifierHash = hashValue(trimmedIdentifier);

    // Search both email_hash and phone_hash
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email_hash: identifierHash },
          { phone_hash: identifierHash },
        ],
      },
    });

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "Login failed. Please check your credentials.",
      });
    }

    if (user.status === "suspended" || user.is_active === 0) {
      return res.status(200).json({
        status: false,
        message: "Login failed. User is suspended or inactive.",
      });
    }

    const passwordIsValid = await bcrypt.compare(
      trimmedPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(200).json({
        status: false,
        message: "Login failed. Please check password.",
      });
    }

    if (!user.otp_verify) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      await User.update(
        {
          otp,
          device_id: login_from === "app" ? device_token : null,
          login_from,
          userIp,
        },
        {
          where: {
            [Op.or]: [
              { email_hash: identifierHash },
              { phone_hash: identifierHash },
            ],
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "Your OTP has not been verified yet. A new OTP has been sent.",
        otp_verify: user.otp_verify,
      });
    }

    const access_token = tokenProcess.generateAccessToken(user);
    const refresh_token = tokenProcess.generateRefreshToken();
    const refreshToken_expiration = Date.now() + 7 * 24 * 60 * 60 * 1000;

    user.refreshToken = refresh_token;
    user.refreshToken_Expiration = refreshToken_expiration;
    user.userIp = userIp;
    await user.save();

    await User.update(
      {
        device_id: login_from === "app" ? device_token : null,
        refreshToken: refresh_token,
        user_status: "Online",
        login_from,
        userIp,
      },
      {
        where: {
          [Op.or]: [
            { email_hash: identifierHash },
            { phone_hash: identifierHash },
          ],
        },
      }
    );

    const updatedUser = await User.findOne({
      where: {
        [Op.or]: [
          { email_hash: identifierHash },
          { phone_hash: identifierHash },
        ],
      },
    });

    res.cookie("refresh_token", refresh_token, { httpOnly: true });

    return res.status(200).json({
      status: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred during the login process.",
    });
  }
};

const delete_user_by_phone = async (req, res) => {
  try {
    const { id } = req.query;

    // Check if phone number is provided
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "Phone number is required" });
    }

    const whereCondition = { id };

    if (id) {
      whereCondition.id = { [Op.eq]: id };
    }

    // Find the user by phone number
    const find_user = await User.findOne({
      where: whereCondition,
    });

    if (!find_user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Check if user type is 'user' or 'admin'
    if (find_user.user_type !== "user" && find_user.user_type !== "admin") {
      return res.status(403).json({
        status: false,
        message:
          "Deletion not allowed. Only 'user' or 'admin' accounts can be deleted.",
      });
    }

    // Delete the user
    await User.destroy({
      where: whereCondition,
    });

    return res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { login, delete_user_by_phone };
