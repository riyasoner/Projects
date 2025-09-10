const db = require("../../../config/config");
const cart = db.cart;
const product = db.product;
const variant = db.variant;
const { Op } = db.Sequelize;
const sequelize = db.sequelize;
exports.addToCart = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, productId, variantId = null, quantity } = req.body;

    let existingItem = await cart.findOne({
      where: { userId, productId, variantId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existingItem) {
      // Update quantity
      await existingItem.update(
        { quantity: existingItem.quantity + quantity },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).json({
        status: true,
        message: "Cart quantity updated",
        data: existingItem,
      });
    } else {
      // Get price from product or variant
      let price = 0;

      if (variantId) {
        const variantData = await variant.findByPk(variantId, {
          transaction: t,
        });
        if (!variantData) {
          await t.rollback();
          return res
            .status(404)
            .json({ status: false, message: "Variant not found" });
        }
        price = variantData.price;
      } else {
        const productData = await product.findByPk(productId, {
          transaction: t,
        });
        if (!productData) {
          await t.rollback();
          return res
            .status(404)
            .json({ status: false, message: "Product not found" });
        }
        price = productData.price;
      }

      // Add to cart
      const newItem = await cart.create(
        {
          userId,
          productId,
          variantId,
          quantity,
          priceAtTheTime: price,
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({
        status: true,
        message: "Item added to cart",
        data: newItem,
      });
    }
  } catch (err) {
    await t.rollback();
    console.error("Error adding to cart:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const items = await cart.findAll({
      where: { userId },
      include: [
        {
          model: product,
          as: "cartProduct",
        },
        {
          model: variant,
          as: "variant",
        },
      ],
    });

    const updated = items.map((item) => {
      const itemJSON = item.toJSON();

      // ✅ Parse product images
      let rawImages = itemJSON.cartProduct?.images;
      if (typeof rawImages === "string") {
        try {
          rawImages = JSON.parse(rawImages);
        } catch {
          rawImages = [];
        }
      }

      if (itemJSON.cartProduct) {
        itemJSON.cartProduct.images = Array.isArray(rawImages)
          ? rawImages.map((img) => `${hostUrl}${img}`)
          : [];
      }

      // ✅ Parse variant images
      let variantImages = itemJSON.variant?.variantImages;
      if (typeof variantImages === "string") {
        try {
          variantImages = JSON.parse(variantImages);
        } catch {
          variantImages = [];
        }
      }

      if (itemJSON.variant) {
        itemJSON.variant.variantImages = Array.isArray(variantImages)
          ? variantImages.map((img) => `${hostUrl}${img}`)
          : [];
      }

      return itemJSON;
    });

    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.updateCartItem = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    const item = await cart.findByPk(cartId);
    if (!item) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    await item.update({ quantity });

    return res
      .status(200)
      .json({ status: true, message: "Cart updated", data: item });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.removeCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;

    const deleted = await cart.destroy({ where: { id: cartId } });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// routes/cart.js
exports.cartSync = async (req, res) => {
  const { cartItems, userId } = req.body;

  if (!userId || !Array.isArray(cartItems)) {
    return res.status(400).json({
      success: false,
      message: "userId and cartItems array are required",
    });
  }

  const responseDetails = [];

  try {
    for (const item of cartItems) {
      const {
        productId,
        variantId = null,
        quantity = 1,
        priceAtTheTime,
      } = item;

      // Validate required fields
      if (!productId || !priceAtTheTime) {
        responseDetails.push({
          productId,
          variantId,
          success: false,
          message: "Missing productId or priceAtTheTime",
        });
        continue;
      }

      // ✅ Check if product exists
      const productExists = await product.findByPk(productId);
      if (!productExists) {
        responseDetails.push({
          productId,
          variantId,
          success: false,
          message: "Product not found",
        });
        continue;
      }

      // ✅ If variantId is provided, check if variant exists
      if (variantId) {
        const variantExists = await variant.findOne({
          where: { id: variantId, productId },
        });

        if (!variantExists) {
          responseDetails.push({
            productId,
            variantId,
            success: false,
            message: "Variant not found or doesn't match product",
          });
          continue;
        }
      }

      // ✅ Check if cart item already exists
      const existingItem = await cart.findOne({
        where: { userId, productId, variantId },
      });

      if (existingItem) {
        await existingItem.update({
          quantity: existingItem.quantity + quantity,
          priceAtTheTime,
        });

        responseDetails.push({
          productId,
          variantId,
          success: true,
          action: "updated",
          message: "Cart item updated",
        });
      } else {
        await cart.create({
          userId,
          productId,
          variantId,
          quantity,
          priceAtTheTime,
        });

        responseDetails.push({
          productId,
          variantId,
          success: true,
          action: "created",
          message: "Cart item added",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Cart sync completed",
      results: responseDetails,
    });
  } catch (err) {
    console.error("Cart Sync Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while syncing cart",
      error: err.message,
    });
  }
};

exports.removeOrderedFromCart = async (req, res) => {
  try {
    const { userId, orderedItems } = req.body;

    if (!userId || !Array.isArray(orderedItems) || orderedItems.length === 0) {
      return res.json({
        success: false,
        message: "Invalid request: userId and orderedItems are required",
      });
    }

    // Build where condition dynamically
    const whereConditions = orderedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId || null,
    }));

    const deletedCount = await cart.destroy({
      where: {
        userId,
        [Op.or]: whereConditions,
      },
    });

    if (deletedCount === 0) {
      return res.json({
        success: false,
        message: "No matching items found in cart to remove",
      });
    }

    return res.json({
      success: true,
      message: "Ordered items removed from cart successfully",
      removedCount: deletedCount,
    });
  } catch (error) {
    console.error("Error removing items from cart:", error);

    return res.json({
      success: false,
      message: "Something went wrong while removing items",
      error: error.message,
    });
  }
};
