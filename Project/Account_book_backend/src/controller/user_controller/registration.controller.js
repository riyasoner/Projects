// controllers/UserController.js
const db = require("../../../config/config");

const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { hashValue } = require("../../utils/cryptoHelper");

const registration = async (req, res) => {
  try {
    const {
      name,
      user_type,
      email_id,
      password,
      phone_no = "", // fallback for optional
      createrBySuperAdmin = false,
      createdByUserId = null,
    } = req.body;

    // Trimmed fields
    const trimmedName = name?.trim();
    const trimmedEmail = email_id?.trim();
    const trimmedPassword = password?.trim();
    const trimmedPhoneNo = phone_no?.trim();

    // Basic required validation
    if (!trimmedName || !user_type || !trimmedEmail || !trimmedPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required: name, user_type, email_id, password",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Validate strong password
    if (!passwordRegex.test(trimmedPassword)) {
      return res.status(400).json({
        status: false,
        message:
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Additional phone number check for super admin
    if (createrBySuperAdmin && !trimmedPhoneNo) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required for Super Admin created users",
      });
    }

    // Validate user_type
    const allowedUserTypes = ["user", "admin"];
    if (!allowedUserTypes.includes(user_type.toLowerCase())) {
      return res.status(400).json({
        status: false,
        message: "Invalid user_type. Allowed values: 'user', 'admin'",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }

    // Validate phone number if present
    if (trimmedPhoneNo && !/^\d{10}$/.test(trimmedPhoneNo)) {
      return res.status(400).json({
        status: false,
        message: "Phone number must be exactly 10 digits",
      });
    }
    const emailHash = hashValue(trimmedEmail);
    const phoneHash = trimmedPhoneNo ? hashValue(trimmedPhoneNo) : null;

    // Check for existing user
    const existingUser = await User.findOne({
      where: createrBySuperAdmin
        ? { phone_hash: phoneHash }
        : { email_hash: emailHash },
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: createrBySuperAdmin
          ? "This phone number already exists"
          : "This email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Create the user
    const user = await User.create({
      name: trimmedName,
      email_id: trimmedEmail,
      email_hash: emailHash,
      password: hashedPassword,
      phone_no: trimmedPhoneNo,
      phone_hash: phoneHash,
      user_type: user_type.toLowerCase(),
      show_password: trimmedPassword,
      createrBySuperAdmin,
      createdByUserId,
    });

    return res.status(201).json({
      status: true,
      message: "Registration created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API for verify otp
const otpVerify = async (req, res) => {
  try {
    const { phone_no, otp } = req.body;

    // ✅ Validate input
    if (!phone_no || !otp) {
      return res.status(400).json({
        status: false,
        message: "Phone number and OTP are required",
      });
    }
    const phoneHash = hashValue(phone_no.trim());

    // ✅ Find user by phone_hash and OTP
    const user = await User.findOne({
      where: { phone_hash: phoneHash, otp },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "OTP does not match or user not found",
      });
    }

    // ✅ Update user as verified
    await User.update(
      { otp_verify: 1, is_active: 1, is_verify: 1 },
      { where: { phone_hash: phoneHash } }
    );

    // ✅ Fetch updated user details
    const updatedUser = await User.findOne({
      where: { phone_no },
      attributes: [
        "id",
        "phone_no",
        "name",
        "email_id",
        "otp_verify",
        "is_verify",
      ],
    });

    return res.status(200).json({
      status: true,
      message: "OTP successfully verified",
      user: updatedUser,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// store otp
const store_otp = async (req, res) => {
  try {
    const { phone_no, otp } = req.body;
    // Check if user exists
    const checkuser = await User.findOne({ where: { phone_no: phone_no } });

    // if (!checkuser) {
    //     return res.json({
    //         status: false,
    //         message: " User doesn't exist",
    //     });
    // }
    // if(!otp){
    //   return res.json({
    //     status: false,
    //     message: "please fill otp",
    // });

    // }

    // store OTP
    const store_otp_db = await User.update(
      { otp: otp },
      {
        where: {
          phone_no: phone_no,
        },
      }
    );

    res.status(200).json({
      status: true,
      message: "OTP stored successfully",
    });
  } catch (error) {
    console.error("OTP store Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registration,
  otpVerify,
  store_otp,
};
