const db = require("../../../config/config");
const SubOrder = db.suborder;
const { Sequelize } = db;

exports.getSellerMonthlyRevenue = async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res
        .status(400)
        .json({ status: false, message: "sellerId is required" });
    }

    const revenueData = await SubOrder.findAll({
      where: {
        sellerId,
        paymentStatus: "paid", // lowercase
      },
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("SUM", Sequelize.col("finalAmount")), "totalRevenue"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
    });

    const formatted = revenueData.map((item) => {
      const date = new Date(item.getDataValue("month") + "-01");
      const monthName = date.toLocaleString("default", { month: "short" });
      return {
        month: monthName,
        totalRevenue: parseFloat(item.getDataValue("totalRevenue")),
      };
    });

    res.status(200).json({ status: true, data: formatted });
  } catch (error) {
    console.error("Seller revenue error:", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};
