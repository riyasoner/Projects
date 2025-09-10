const db = require("../../../config/config");
const inventory = db.inventory;
const product = db.product;
const variant = db.variant;
const seller = db.user;
exports.addOrUpdateInventory = async (req, res) => {
  try {
    const { productId, variantId = null, sellerId, quantity, location, restockDate } = req.body;

    // ✅ Check product exists
    const prodExists = await product.findByPk(productId);
    if (!prodExists) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    // ✅ Check variant if provided
    if (variantId) {
      const variantExists = await variant.findByPk(variantId);
      if (!variantExists) {
        return res.status(404).json({ status: false, message: "Variant not found" });
      }
    }

    // ✅ Check existing inventory entry
    const existing = await inventory.findOne({
      where: { productId, variantId, sellerId },
    });

    let result;
    if (existing) {
      // Update quantity
      await existing.update({ quantity, location, restockDate });
      result = existing;
    } else {
      // Create new entry
      result = await inventory.create({ productId, variantId, sellerId, quantity, location, restockDate });
    }

    return res.status(200).json({
      status: true,
      message: existing ? "Inventory updated" : "Inventory created",
      data: result,
    });
  } catch (err) {
    console.error("Error managing inventory:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.getInventoryBySeller = async (req, res) => {
  try {
    const { sellerId } = req.query;

    const inventoryList = await inventory.findAll({
      where: { sellerId },
      include: [
        { model: product, as: "product" },
        { model: variant, as: "variant" },
      ],
    });

    return res.status(200).json({ status: true, data: inventoryList });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await inventory.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Inventory not found" });
    }

    return res.status(200).json({ status: true, message: "Inventory entry deleted" });
  } catch (err) {
    console.error("Error deleting inventory:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await inventory.findOne({
      where: { id },
      include: [
        {
          model: product,
          as: "product",
          attributes: ["id", "title", "slug", "description"],
        },
        {
          model: variant,
          as: "variant",
          attributes: ["id", "variantName", "sku", "price"],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({ status: false, message: "Inventory not found" });
    }

    return res.status(200).json({
      status: true,
      data: item,
    });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sellerId, // optional filter
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (sellerId) {
      where.sellerId = sellerId;
    }

    const { count, rows } = await inventory.findAndCountAll({
      where,
      include: [
        {
          model: product,
          as: "product",
          attributes: ["id", "title", "slug"],
        },
        {
          model: variant,
          as: "variant",
          attributes: ["id", "variantName", "sku"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Inventory list fetched successfully",
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching inventory list:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
