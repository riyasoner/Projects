const db = require("../../../config/config");
const user = db.user;
const order = db.order;
const product = db.product;

exports.getAdminDashboardStats = async (req, res) => {
  try {
    // 👥 Total users (excluding admin)
    const totalUsers = await user.count({
      where: {
        userType: "user", // adjust as per your user roles
      },
    });

    // 📦 Total orders
    const totalOrders = await order.count();

    // 🛍️ Total products
    const totalProducts = await product.count();

    // 💰 Total revenue (from orders)
    const totalRevenueResult = await order.findOne({
      attributes: [
        [
          order.sequelize.fn("SUM", order.sequelize.col("finalAmount")),
          "totalRevenue",
        ],
      ],
      // optional: include only completed/delivered orders
      where: { orderStatus: "delivered" },
      raw: true,
    });

    const totalRevenue = parseFloat(
      totalRevenueResult.totalRevenue || 0
    ).toFixed(2);

    return res.status(200).json({
      status: true,
      message: "Admin dashboard stats fetched successfully",
      data: {
        totalRevenue,
        totalUsers,
        totalOrders,
        totalProducts,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching dashboard stats",
    });
  }
};
