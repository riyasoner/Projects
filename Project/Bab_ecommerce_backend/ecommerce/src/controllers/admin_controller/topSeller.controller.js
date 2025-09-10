const db = require("../../../config/config");
const { fn, col, literal } = require("sequelize");

const Suborder = db.suborder;
const User = db.user;

exports.getTopSellers = async (req, res) => {
  try {
    const topSellers = await Suborder.findAll({
      attributes: [
        "sellerId",
        [fn("SUM", col("suborder.finalAmount")), "totalEarnings"],
        [fn("COUNT", col("suborder.id")), "totalOrders"],
      ],
      where: { paymentStatus: "paid" },
      include: [
        {
          model: User,
          as: "seller",
          attributes: [
            "id",
            "fullName",
            "email",
            "phoneNo",
            "userType",
            "profileImage",
          ],
        },
      ],
      group: ["suborder.sellerId", "seller.id"],
      order: [[literal("totalEarnings"), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    // Map karke profileImage ka URL banana
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const updatedSellers = topSellers.map((seller) => {
      if (seller.seller && seller.seller.profileImage) {
        seller.seller.profileImage = `${baseUrl}/${seller.seller.profileImage}`;
      }
      return seller;
    });

    return res.status(200).json({
      status: true,
      message: "Top sellers fetched successfully",
      data: updatedSellers,
    });
  } catch (error) {
    console.error("Error fetching top sellers:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching top sellers",
      error: error.message,
    });
  }
};
