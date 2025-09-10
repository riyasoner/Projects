const db = require("../../../config/config");
const Order = db.order;
const OrderItem = db.orderitem;
const Product = db.product;
const User = db.user; // optional: to show customer info

// response helper
const sendResponse = (res, status, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ status, message, data });
};

exports.getRecentOrders = async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return sendResponse(res, false, "Seller ID is required", null, 400);
  }

  try {
    const recentOrders = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
          attributes: ["id", "title", "sellerId"],
        },
        {
          model: Order,
          as: "order",
          attributes: [
            "id",
            "userId",
            "totalAmount",
            "paymentStatus",
            "orderStatus",
            "createdAt",
          ],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "fullName", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10, // latest 10 orders
    });

    return sendResponse(
      res,
      true,
      "Recent orders fetched successfully",
      recentOrders
    );
  } catch (error) {
    console.error("Get Recent Orders Error:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
