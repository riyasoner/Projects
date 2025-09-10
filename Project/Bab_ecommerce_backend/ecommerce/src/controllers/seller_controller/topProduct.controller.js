const db = require("../../../config/config");
const OrderItem = db.orderitem;
const Product = db.product;
const { fn, col, literal } = require("sequelize");

// Helper
const sendResponse = (res, status, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ status, message, data });
};

exports.getTopProductsBySeller = async (req, res) => {
  const { sellerId, limit = 5 } = req.query;

  if (!sellerId) {
    return sendResponse(res, false, "Seller ID is required", null, 400);
  }

  try {
    const topProducts = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
          attributes: ["id", "title"], // change title to name if needed
        },
      ],
      attributes: [
        [fn("SUM", col("orderitem.quantity")), "totalSold"],
        [literal("SUM(orderitem.quantity * orderitem.price)"), "totalRevenue"],
      ],
      group: ["product.id"],
      order: [[fn("SUM", col("orderitem.quantity")), "DESC"]],
      limit: parseInt(limit),
      raw: true,
    });

    return sendResponse(
      res,
      true,
      "Top products fetched successfully",
      topProducts
    );
  } catch (error) {
    console.error("Get Top Products Error:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
