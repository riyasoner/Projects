const db = require("../../../config/config");
const Order = db.order;
const OrderItem = db.orderitem;
const Product = db.product;
const { fn, col, literal } = require("sequelize");

// Response helper
const sendResponse = (res, status, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ status, message, data });
};

exports.getSalesOverviewBySeller = async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return sendResponse(res, false, "Seller ID is required", null, 400);
  }

  try {
    const salesData = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
          attributes: [],
        },
        {
          model: Order,
          as: "order",
          where: {
            paymentStatus: "paid",
            orderStatus: "delivered",
          },
          attributes: [],
        },
      ],
      attributes: [
        [fn("DATE_FORMAT", col("order.createdAt"), "%Y-%m"), "month"],
        [
          fn("SUM", literal("orderitem.quantity * orderitem.price")),
          "totalSales",
        ],
        [fn("COUNT", fn("DISTINCT", col("orderitem.orderId"))), "totalOrders"],
      ],
      group: [fn("DATE_FORMAT", col("order.createdAt"), "%Y-%m")],
      order: [[fn("DATE_FORMAT", col("order.createdAt"), "%Y-%m"), "ASC"]],
      raw: true,
    });

    return sendResponse(
      res,
      true,
      "Sales overview fetched successfully",
      salesData
    );
  } catch (error) {
    console.error("Get Sales Overview Error:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
