const db = require("../../../config/config");
const SubOrder = db.suborder;
const { fn, col } = require("sequelize");

// ✅ Reusable response utility
const sendResponse = (res, status, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ status, message, data });
};

// ✅ Seller Dashboard Controller (using SubOrders only)
exports.getSellerDashboard = async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return sendResponse(res, false, "Seller ID is required", null, 400);
  }

  try {
    const stats = await SubOrder.findAll({
      where: {
        sellerId,
        paymentStatus: "paid", // ✅ Only paid
        orderStatus: "delivered", // ✅ Only delivered
      },
      attributes: [
        [fn("SUM", col("finalAmount")), "totalSales"], // seller's net sales
        [fn("COUNT", col("id")), "totalOrders"], // total suborders (per seller)
        [fn("AVG", col("finalAmount")), "averageOrderValue"],
        [fn("SUM", col("discount")), "totalDiscounts"], // ✅ new metric
      ],
      raw: true,
    });

    const result = stats[0] || {};

    return sendResponse(
      res,
      true,
      "Seller dashboard data fetched successfully",
      {
        totalSales: parseFloat(result.totalSales || 0).toFixed(2),
        totalOrders: parseInt(result.totalOrders || 0),
        totalDiscounts: parseFloat(result.totalDiscounts || 0).toFixed(2), // 👈 replaces conversionRate
        averageOrderValue: parseFloat(result.averageOrderValue || 0).toFixed(2),
      }
    );
  } catch (error) {
    console.error("Get Seller Dashboard Error:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
