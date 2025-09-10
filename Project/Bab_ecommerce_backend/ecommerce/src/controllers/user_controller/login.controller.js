const db = require("../../../config/config");
const User = db.user;
const bcrypt = require("bcryptjs");
const tokenProcess = require("../../services/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({
        status: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ where: { email: trimmedEmail } });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not registered. Please sign up first.",
      });
    }
    // 👉 Check if seller is approved
    if (user.userType === "seller" && user.isApproved === false) {
      return res.status(403).json({
        status: false,
        message: "Your seller account is not approved by the admin yet.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      trimmedPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid  password. Please try again.",
      });
    }

    const access_token = tokenProcess.generateAccessToken(user);
    const refresh_token = tokenProcess.generateRefreshToken(user);
    const refreshTokenExpiration = Date.now() + 7 * 24 * 60 * 60 * 1000;

    user.refreshToken = refresh_token;
    user.refreshTokenExpiration = refreshTokenExpiration;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Login successful!",
      access_token,
      refresh_token,
      userType: user.userType,
      userId: user.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

module.exports = {
  login,
};
