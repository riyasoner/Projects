const { Op, fn, col, literal } = require("sequelize");
const db = require("../../../config/config");
const order = db.order;

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const where = {
      paymentStatus: "paid",
    };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    if (userId) {
      where.userId = userId;
    }

    const monthlyRevenue = await order.findAll({
      where,
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%b %Y"), "monthName"], // 👈 Month name like Jan 2025
        [fn("SUM", col("finalAmount")), "totalRevenue"],
        [fn("COUNT", col("id")), "totalOrders"],
      ],
      group: [fn("DATE_FORMAT", col("createdAt"), "%b %Y")],
      order: [[literal("MIN(createdAt)"), "ASC"]],
      raw: true,
    });

    return res.status(200).json({
      status: true,
      message: "Monthly revenue fetched successfully",
      data: monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching monthly revenue",
    });
  }
};
