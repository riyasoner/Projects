const {
  user: User,
  product: Product,
  Sequelize,
} = require("../../../config/config");

const getSellerSummary = async (req, res) => {
  try {
    const [totalSellers, activeSellers, totalProducts] = await Promise.all([
      User.count({ where: { userType: "seller" } }),
      User.count({ where: { userType: "seller", status: "active" } }),
      Product.count(), // Total products listed by all sellers
    ]);

    return res.status(200).json({
      status: true,
      message: "Seller summary fetched successfully",
      data: {
        totalSellers,
        activeSellers,
        totalProducts,
      },
    });
  } catch (error) {
    console.error("[Seller Summary Error]:", error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch seller summary",
    });
  }
};

module.exports = { getSellerSummary };
