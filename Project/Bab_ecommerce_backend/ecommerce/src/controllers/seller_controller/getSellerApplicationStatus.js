const db = require("../../../config/config");
const sellerProfile = db.sellerProfile;
const User = db.user;

// helper function
const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

exports.getSellerApplicationStatus = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch seller profile
    const profile = await sellerProfile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "phoneNo", "userType"],
        },
      ],
    });

    if (!profile) {
      return sendResponse(
        res,
        404,
        "No seller application found for this user."
      );
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Ensure businessDocs is an array
    let docsArray = [];
    if (profile.businessDocs) {
      try {
        docsArray = Array.isArray(profile.businessDocs)
          ? profile.businessDocs
          : JSON.parse(profile.businessDocs);
      } catch (err) {
        docsArray = [];
      }
    }

    const profileWithDocs = {
      ...profile.toJSON(),
      businessDocs: docsArray.map((doc) => `${baseUrl}${doc}`),
    };

    return sendResponse(
      res,
      200,
      "Seller application fetched successfully.",
      profileWithDocs
    );
  } catch (error) {
    console.error("Error in getSellerApplicationStatus:", error);
    return sendResponse(
      res,
      500,
      "An error occurred while fetching seller application status."
    );
  }
};
