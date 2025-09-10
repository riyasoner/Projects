const db = require("../../../config/config");
const Address = db.address;
const ShippingFee = db.shippingFee;
const Product = db.product;
const Variant = db.variant;

exports.checkout = async (req, res) => {
  try {
    const {
      userId,
      shippingAddressId,
      items = [],
      couponCode,
      totalWeight = 0,
    } = req.body;

    if (!userId || !shippingAddressId || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields or empty cart",
        status: false,
      });
    }

    const userAddress = await Address.findByPk(shippingAddressId);
    if (!userAddress) {
      return res
        .status(404)
        .json({ message: "Shipping address not found", status: false });
    }

    let totalAmount = 0;
    const itemSummary = [];
    let totalPrepaidDiscount = 0;

    // 🛒 Step 1: Calculate total and prepare item summary
    for (const item of items) {
      const { productId, variantId, quantity } = item;
      const product = await Product.findByPk(productId);
      const variant = variantId ? await Variant.findByPk(variantId) : null;

      if (!product) continue;

      const basePrice = variant ? variant.price : product.price;
      // Regular discount (if any)
      const discountPercent =
        variant?.discountPercent || product.discountPercent || 0;
      const discountedPrice = basePrice - (basePrice * discountPercent) / 100;

      // 💸 Prepaid Discount from Product
      let prepaidDiscount = 0;
      if (product.prepaidDiscountType && product.prepaidDiscountValue != null) {
        if (product.prepaidDiscountType === "percentage") {
          prepaidDiscount =
            (discountedPrice * product.prepaidDiscountValue) / 100;
        } else if (product.prepaidDiscountType === "fixed") {
          prepaidDiscount = product.prepaidDiscountValue;
        }
      }

      // Cap prepaidDiscount if greater than price
      if (prepaidDiscount > discountedPrice) prepaidDiscount = discountedPrice;

      const totalItemAmount = discountedPrice * quantity;
      const totalPrepaidDiscountAmount = prepaidDiscount * quantity;

      totalAmount += totalItemAmount;
      totalPrepaidDiscount += totalPrepaidDiscountAmount;

      itemSummary.push({
        productId,
        variantId,
        quantity,
        basePrice: basePrice.toFixed(2),
        discountPercent,
        discountedPrice: discountedPrice.toFixed(2),
        prepaidDiscountPerUnit: prepaidDiscount.toFixed(2),
        total: totalItemAmount.toFixed(2),
      });
    }

    // 🎟️ Step 2: Apply Coupon
    const { discount, message: couponMessage } = await exports.validateCoupon({
      couponCode,
      totalAmount,
      userId,
      db,
    });

    // 🚚 Step 3: Shipping Fee Calculation
    const shippingRules = await ShippingFee.findAll({
      where: { isActive: true },
    });
    let shippingFee = 0;

    for (const rule of shippingRules) {
      if (
        rule.shippingType === "free_above" &&
        totalAmount >= rule.freeAboveAmount
      ) {
        shippingFee = 0;
        break;
      }
      if (
        rule.shippingType === "location_based" &&
        rule.city.toLowerCase() === userAddress.city.toLowerCase()
      ) {
        shippingFee += rule.locationFee;
      }
      if (rule.shippingType === "flat_rate") {
        shippingFee += rule.flatRate;
      }
      if (rule.shippingType === "weight_based") {
        shippingFee += rule.weightRatePerKg * totalWeight;
      }
    }

    const finalAmount = totalAmount - discount + shippingFee;
    const finalAmountWithPrepaid = finalAmount - totalPrepaidDiscount;

    return res.status(200).json({
      message: "Checkout summary generated",
      status: true,
      shippingAddress: userAddress,
      totalAmount: totalAmount.toFixed(2),
      discount: discount.toFixed(2),
      prepaidDiscount: totalPrepaidDiscount.toFixed(2), // 👈 NEW
      shippingFee: shippingFee.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      finalAmountIfPrepaid: finalAmountWithPrepaid.toFixed(2), // 👈 NEW

      couponMessage, // helpful for frontend to show why coupon was rejected
      items: itemSummary,
    });
  } catch (error) {
    console.error("Checkout Summary Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

exports.validateCoupon = async ({ couponCode, totalAmount, userId, db }) => {
  if (!couponCode) return { discount: 0, message: null };

  const coupon = await db.coupon.findOne({
    where: { code: couponCode, status: "active" },
  });

  if (!coupon) {
    return { discount: 0, message: "Invalid or expired coupon" };
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return { discount: 0, message: "Coupon is not valid currently" };
  }

  if (totalAmount < coupon.minOrderValue) {
    return {
      discount: 0,
      message: `Minimum order value should be ₹${coupon.minOrderValue}`,
    };
  }

  const totalUsage = await db.couponusage.count({
    where: { couponId: coupon.id },
  });

  if (coupon.usageLimit && totalUsage >= coupon.usageLimit) {
    return { discount: 0, message: "Coupon usage limit exceeded" };
  }

  const userUsage = await db.couponusage.findOne({
    where: { couponId: coupon.id, userId },
  });

  if (userUsage && userUsage.usageCount >= coupon.usagePerUser) {
    return { discount: 0, message: "You have already used this coupon" };
  }

  let discount = 0;

  if (coupon.discountType === "percent") {
    discount = (totalAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  return { discount, message: null };
};
