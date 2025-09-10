const db = require("../../../config/config");
const FcmToken = db.fcmToken;

// /api/fcm/register
const fcmRegistration = async (req, res) => {
  try {
    const { token, userType, userId } = req.body;
    if (!token || !userId || !userType) {
      return res.status(400).json({
        status: false,
        message: "userId, userType aur token required hain",
      });
    }

    // Upsert FCM token (agar pehle se hai toh update karega, warna insert)
    const data = await FcmToken.upsert({
      userId,
      userType,
      token,
    });

    return res.status(200).json({
      status: true,
      message: "FCM token registered successfully",
      data,
    });
  } catch (error) {
    console.error("FCM Registration Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { fcmRegistration };
