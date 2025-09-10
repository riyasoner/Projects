const db = require("../../../config/config");
const Product = db.product;
const Variant = db.variant;
const { fn, col, Op, where } = require("sequelize");

// Response helper
const sendResponse = (res, status, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ status, message, data });
};

exports.getInventorySummary = async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return sendResponse(res, false, "Seller ID is required", null, 400);
  }

  try {
    // 📦 Product-level summary
    const productSummary = await Product.findOne({
      where: { sellerId },
      attributes: [
        [fn("COUNT", col("id")), "totalProducts"],
        [fn("SUM", col("stock")), "totalProductStock"],
      ],
      raw: true,
    });

    // 🛍️ Variant-level summary (join with product)
    const variantSummary = await Variant.findOne({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
          attributes: [], // don't select product fields
        },
      ],
      attributes: [
        [fn("COUNT", col("variant.id")), "totalVariants"],
        [fn("SUM", col("variant.stock")), "totalVariantStock"],
      ],
      raw: true,
    });

    // ⚠️ Low stock products
    const lowStockProducts = await Product.count({
      where: {
        sellerId,
        stock: { [Op.lt]: 10 },
      },
    });

    // ⚠️ Low stock variants (via product)
    const lowStockVariants = await Variant.count({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
          attributes: [],
        },
      ],
      where: {
        stock: { [Op.lt]: 10 },
      },
    });

    return sendResponse(res, true, "Inventory summary fetched successfully", {
      totalProducts: parseInt(productSummary?.totalProducts || 0),
      totalVariants: parseInt(variantSummary?.totalVariants || 0),
      totalQuantity:
        parseInt(productSummary?.totalProductStock || 0) +
        parseInt(variantSummary?.totalVariantStock || 0),
      lowStockCount: (lowStockProducts || 0) + (lowStockVariants || 0),
    });
  } catch (error) {
    console.error("Get Inventory Summary Error:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};
