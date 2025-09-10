const db = require("../../../config/config");

const wishlist = db.wishlist;
const product = db.product;
const user = db.user;
const variant = db.variant;
// ✅ Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if user exists
    const userExists = await user.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Check if product exists
    const productExists = await product.findByPk(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    // Check if already in wishlist
    const existing = await wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res
        .status(400)
        .json({ status: false, message: "Product already in wishlist" });
    }

    // Add to wishlist
    const item = await wishlist.create({ userId, productId });

    return res
      .status(200)
      .json({ status: true, message: "Added to wishlist", data: item });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Get all wishlist items for a user
exports.getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const lim = parseInt(limit);
    const offset = (parseInt(page) - 1) * lim;

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const { count, rows } = await wishlist.findAndCountAll({
      where: { userId },
      limit: lim,
      offset,
      include: [
        {
          model: product,
          as: "product",
          include: [
            {
              model: variant,
              as: "variants", // Make sure your association alias matches
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const updatedItems = rows.map((item) => {
      const itemJSON = item.toJSON();

      // Handle product images
      let rawImages = itemJSON.product?.images;
      if (typeof rawImages === "string") {
        try {
          rawImages = JSON.parse(rawImages);
        } catch {
          rawImages = [];
        }
      }

      const fullImages = Array.isArray(rawImages)
        ? rawImages.map((img) => `${hostUrl}${img}`)
        : [];

      itemJSON.product.images = fullImages;

      // Handle variant images
      if (Array.isArray(itemJSON.product?.variants)) {
        itemJSON.product.variants = itemJSON.product.variants.map((variant) => {
          let variantImgs = variant.variantImages;

          if (typeof variantImgs === "string") {
            try {
              variantImgs = JSON.parse(variantImgs);
            } catch {
              variantImgs = [];
            }
          }

          const fullVariantImgs = Array.isArray(variantImgs)
            ? variantImgs.map((img) => `${hostUrl}${img}`)
            : [];

          return {
            ...variant,
            variantImages: fullVariantImgs,
          };
        });
      }

      return itemJSON;
    });

    return res.status(200).json({
      status: true,
      message: "Wishlist fetched successfully",
      data: updatedItems,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / lim),
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const deleted = await wishlist.destroy({
      where: { userId, productId },
    });

    if (deleted) {
      return res
        .status(200)
        .json({ status: true, message: "Removed from wishlist" });
    }

    return res
      .status(404)
      .json({ status: false, message: "Item not found in wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
