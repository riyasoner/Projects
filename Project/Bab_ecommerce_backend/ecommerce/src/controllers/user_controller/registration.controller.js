const db = require("../../../config/config");
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const userWallet = db.userWallet;
// User Registration Controller
const userRegistration = async (req, res) => {
  try {
    const { fullName, phoneNo, email, password, userType } = req.body;

    // ✅ Check for required fields
    if (!fullName || !phoneNo || !email || !password || !userType) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all required fields",
      });
    }

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      fullName,
      phoneNo,
      email,
      password: hashedPassword,
      userType,
      profileImage: req.file ? `profileImage/${req.file.filename}` : null,
    });

    // ✅ Create wallet for this user
    await userWallet.create({
      userId: newUser.id,
      realBalance: 0.0,
      promoBalance: 0.0,
      withdrawnAmount: 0.0,
      pendingBalance: 0.0,
      currency: "INR",
    });

    // ✅ Exclude sensitive fields before sending response
    const responseUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      phoneNo: newUser.phoneNo,
      email: newUser.email,
      userType: newUser.userType,
      profileImage: newUser.profileImage,
      isVerify: newUser.isVerify,
      isApproved: newUser.isApproved,
    };

    return res.status(201).json({
      status: true,
      message: "Registration successful",
      data: responseUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

module.exports = {
  userRegistration,
};
