const db = require("../../../config/config");
const order = db.order;
const orderitem = db.orderitem;
const product = db.product;
const variant = db.variant;
const address = db.address;
const user = db.user;
const { Op, Sequelize } = require("sequelize");
const Razorpay = require("razorpay");
const sendOrderEmails = require("./sendOrderMail");
const { wallet, walletTransaction, suborder } = db;
const razorpayInstance = require("../../../config/razorpay");
const { applyCoinRule } = require("../admin_controller/userCoinRuleController");
const OrderCustomisation = db.orderCustomisation;
const Order = db.order;
const Product = db.product;
const coin = db.coin;
const coinTransaction = db.coinTransaction;
const sequelize = db.sequelize;
const { sendToMany } = require("../../server/notify");
const FcmToken = db.fcmToken;
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, sellerId, orderStatus } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (orderStatus) whereClause.orderStatus = orderStatus;

    const orders = await db.order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
        {
          model: db.address,
          as: "shippingAddress",
        },
        {
          model: db.orderitem,
          as: "items",
          include: [
            {
              model: db.product,
              as: "product",
              where: sellerId ? { sellerId } : undefined,
              required: !!sellerId,
              attributes: {
                exclude: [], // or include if needed
              },
            },
            {
              model: db.variant,
              as: "variant",
            },
            {
              model: db.suborder,
              as: "suborder",
              attributes: ["trackingUrl"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const ordersWithImage = orders.rows.map((order) => {
      order.items.forEach((item) => {
        if (item.product?.images) {
          try {
            let parsedImages = item.product.images;
            if (typeof parsedImages === "string") {
              parsedImages = JSON.parse(parsedImages);
            }

            if (Array.isArray(parsedImages)) {
              item.product.images = parsedImages.map((imgPath) =>
                imgPath.startsWith("http") ? imgPath : `${hostUrl}${imgPath}`
              );
            } else {
              item.product.images = [];
            }
          } catch (err) {
            item.product.images = [];
          }
        }

        // Optional: variant images processing
        if (item.variant?.variantImages) {
          try {
            let variantImgs = item.variant.variantImages;
            if (typeof variantImgs === "string") {
              variantImgs = JSON.parse(variantImgs);
            }

            if (Array.isArray(variantImgs)) {
              item.variant.variantImages = variantImgs.map((imgPath) =>
                imgPath.startsWith("http") ? imgPath : `${hostUrl}${imgPath}`
              );
            } else {
              item.variant.variantImages = [];
            }
          } catch (err) {
            item.variant.variantImages = [];
          }
        }
      });
      return order;
    });

    return res.status(200).json({
      totalOrders: orders.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(orders.count / limit),
      data: ordersWithImage,
      status: true,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await db.order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
        {
          model: db.address,
          as: "shippingAddress",
        },
        {
          model: db.orderCustomisation,
          as: "customisations",
        },

        {
          model: db.orderitem,
          as: "items",
          include: [
            {
              model: db.product,
              as: "product",
            },
            {
              model: db.variant,
              as: "variant",
            },
            {
              model: db.suborder,
              as: "suborder",
              attributes: ["trackingUrl", "trackingNumber", "courierName"],
            },
          ],
        },
      ],
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", status: false });

    // Construct full image URLs
    const hostUrl = `${req.protocol}://${req.get("host")}`;
    order.items.forEach((item) => {
      if (item.product && item.product.images) {
        try {
          const parsedImages = JSON.parse(item.product.images);
          item.product.images = parsedImages.map((img) => `${hostUrl}${img}`);
        } catch {
          item.product.images = [];
        }
      }
      if (item.variant && item.variant.variantImages) {
        try {
          const parsedVariantImages = JSON.parse(item.variant.variantImages);
          item.variant.variantImages = parsedVariantImages.map(
            (img) => `${hostUrl}${img}`
          );
        } catch {
          item.variant.variantImages = [];
        }
      }
    });

    res.status(200).json({
      data: order,
      message: "order retrive successfully",
      status: false,
    });
  } catch (error) {
    console.error("Get Order by ID Error:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await db.order.findByPk(orderId);
    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", status: false });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({
      message: "Order updated successfully",
      data: order,
      status: true,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db.order.findByPk(orderId);
    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", status: false });

    await db.orderitem.destroy({ where: { orderId } }); // delete order items first
    await order.destroy(); // then delete order

    res
      .status(200)
      .json({ message: "Order deleted successfully", status: true });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

exports.getOrderSummary = async (req, res) => {
  try {
    const { sellerId } = req.query;

    let totalOrders, totalRevenueResult, statusCounts;

    if (sellerId) {
      // ---------- SELLER CASE (suborder) ----------
      const whereClause = { sellerId };

      // Total Orders (count of suborders for seller)
      totalOrders = await db.suborder.count({ where: whereClause });

      // Status-wise counts
      const statuses = [
        "pending",
        "placed",
        "shipped",
        "delivered",
        "cancelled",
        "processing",
      ];
      statusCounts = await Promise.all(
        statuses.map(async (status) => {
          const count = await db.suborder.count({
            where: { ...whereClause, orderStatus: status },
          });
          return { status, count };
        })
      );

      // Revenue (seller-specific)
      totalRevenueResult = await db.suborder.findAll({
        where: whereClause,
        attributes: [
          [
            db.Sequelize.fn("SUM", db.Sequelize.col("finalAmount")),
            "totalRevenue",
          ],
        ],
        raw: true,
      });
    } else {
      // ---------- ADMIN CASE (order) ----------
      const whereClause = {};

      // Total Orders (all orders)
      totalOrders = await db.order.count({ where: whereClause });

      // Status-wise counts
      const statuses = [
        "pending",
        "placed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      statusCounts = await Promise.all(
        statuses.map(async (status) => {
          const count = await db.order.count({
            where: { ...whereClause, orderStatus: status },
          });
          return { status, count };
        })
      );

      // Revenue (whole order revenue)
      totalRevenueResult = await db.order.findAll({
        where: whereClause,
        attributes: [
          [
            db.Sequelize.fn("SUM", db.Sequelize.col("totalAmount")),
            "totalRevenue",
          ],
        ],
        raw: true,
      });
    }

    return res.status(200).json({
      status: true,
      totalOrders,
      totalRevenue: parseFloat(totalRevenueResult[0].totalRevenue || 0).toFixed(
        2
      ),
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Order Summary Error:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
exports.calculateShippingFee = async ({
  db,
  totalAmount,
  address,
  totalWeight,
}) => {
  const rules = await db.shippingFee.findAll({ where: { isActive: true } });
  let shippingCost = 0;

  for (const rule of rules) {
    if (
      rule.shippingType === "free_above" &&
      totalAmount >= rule.freeAboveAmount
    ) {
      return 0; // early exit if free shipping applies
    }

    if (
      rule.shippingType === "location_based" &&
      rule.city.toLowerCase() === address.city.toLowerCase()
    ) {
      shippingCost += rule.locationFee || 0;
    }

    if (rule.shippingType === "weight_based") {
      const weight = parseFloat(totalWeight || 0);
      shippingCost += weight * (rule.weightRatePerKg || 0);
    }

    if (rule.shippingType === "flat_rate") {
      shippingCost += rule.flatRate || 0;
    }
  }

  return shippingCost;
};
// utils/coupon.js
exports.validateCoupon = async ({
  couponCode,
  totalAmount,
  userId,
  db,
  cartItems = [],
}) => {
  try {
    if (!couponCode) return { discount: 0, message: null };

    // 1. Coupon exists and active
    const coupon = await db.coupon.findOne({
      where: { code: couponCode, status: "active" },
    });

    if (!coupon) {
      return { discount: 0, message: "Invalid or expired coupon" };
    }

    const now = new Date();

    // 2. Date check
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return { discount: 0, message: "Coupon not valid currently" };
    }

    // 3. Minimum order check
    if (Number(totalAmount) < Number(coupon.minOrderValue)) {
      return {
        discount: 0,
        message: `Minimum order value should be ₹${coupon.minOrderValue}`,
      };
    }

    // 4. Usage limits
    const totalUsage = await db.couponusage.count({
      where: { couponId: coupon.id },
    });

    if (totalUsage >= Number(coupon.usageLimit)) {
      return { discount: 0, message: "Coupon usage limit exceeded" };
    }

    const userUsage = await db.couponusage.findOne({
      where: { couponId: coupon.id, userId },
    });

    if (userUsage && userUsage.usageCount >= Number(coupon.usagePerUser)) {
      return { discount: 0, message: "You have already used this coupon" };
    }

    // 5. Calculate eligibleAmount based on appliedOnType
    let eligibleAmount = 0;

    switch (coupon.appliedOnType) {
      case "product": {
        const item = cartItems.find(
          (i) => i.productId === Number(coupon.appliedOnId)
        );
        if (item) eligibleAmount = Number(item.price) * Number(item.quantity);
        break;
      }
      case "subCategory": {
        const items = cartItems.filter(
          (i) => i.subCategoryId === Number(coupon.appliedOnId)
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        break;
      }
      case "category": {
        const items = cartItems.filter(
          (i) => i.categoryId === Number(coupon.appliedOnId)
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        break;
      }
      case "mainCategory": {
        const items = cartItems.filter(
          (i) => i.mainCategoryId === Number(coupon.appliedOnId)
        );
        eligibleAmount = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        break;
      }
      case "all": {
        eligibleAmount = Number(totalAmount);
        break;
      }
      default:
        eligibleAmount = 0;
    }

    if (eligibleAmount <= 0) {
      return {
        discount: 0,
        message: "Coupon not applicable on selected items",
      };
    }

    // 6. Final discount calculation
    let discount = 0;

    if (coupon.discountType === "percent") {
      discount = (eligibleAmount * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Number(coupon.discountValue);
    }

    // Negative discount avoid
    if (discount < 0 || isNaN(discount)) discount = 0;
    console.log(discount);
    return {
      discount: Number(discount.toFixed(2)),
      message: null,
      couponId: coupon.id,
      appliedOnType: coupon.appliedOnType,
    };
  } catch (error) {
    console.error("validateCoupon error:", error);
    return { discount: 0, message: "Something went wrong" };
  }
};

exports.cancelOrder = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { orderId } = req.params;
    const { reason, refundMethod } = req.body;

    // ✅ Validate reason
    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Cancellation reason is required.",
        status: false,
      });
    }

    // ✅ Fetch order
    const orderData = await order.findOne({
      where: { id: orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
        status: false,
      });
    }

    // ✅ Fetch items
    const items = await orderitem.findAll({
      where: { orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    orderData.items = items;

    // ✅ Check order status
    if (["cancelled", "delivered"].includes(orderData.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled as it is already ${orderData.orderStatus}.`,
        status: false,
      });
    }

    const isPaid = orderData.paymentStatus === "paid";
    const isCOD = orderData.paymentMethod === "cod";
    // ✅ Validate refund method
    if (!(isCOD && !isPaid)) {
      if (!["wallet", "bank"].includes(refundMethod)) {
        return res.status(400).json({
          message: "Invalid refund method. Must be 'wallet' or 'bank'.",
          status: false,
        });
      }
    }

    // ✅ Restore inventory
    for (const item of orderData.items) {
      if (item.variantId) {
        const variantRecord = await variant.findOne({
          where: { id: item.variantId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (variantRecord) {
          variantRecord.stock += item.quantity;
          await variantRecord.save({ transaction: t });
        }
      } else {
        const productRecord = await product.findOne({
          where: { id: item.productId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (productRecord) {
          productRecord.stock += item.quantity;
          await productRecord.save({ transaction: t });
        }
      }
    }
    // =========================
    // Notify Sellers about cancellation
    // =========================
    try {
      const sellerIds = [...new Set(orderData.items.map((i) => i.sellerId))];

      for (const sellerId of sellerIds) {
        const tokens = (
          await FcmToken.findAll({
            where: { userId: sellerId, userType: "seller" },
          })
        )
          .map((r) => r.token)
          .filter(Boolean);

        if (!tokens.length) continue;

        await sendToMany(
          tokens,
          {
            title: "Order Cancelled",
            body: `Order #${orderId} has been cancelled by the customer.`,
          },
          {
            orderId: String(orderId),
            type: "ORDER_CANCELLED",
            userType: "seller",
            redirectUrl: "/seller/orders",
          }
        );
      }
    } catch (notifyErr) {
      console.error("FCM Notification Error on cancellation:", notifyErr);
    }

    let refundData = null;

    // =========================
    // BANK REFUND (Razorpay)
    // =========================
    if (isPaid && !isCOD && refundMethod === "bank") {
      if (!orderData.razorpayPaymentId) {
        throw new Error("Missing Razorpay Payment ID for refund.");
      }

      const rawAmount = Number(orderData.finalAmount);
      if (isNaN(rawAmount) || rawAmount <= 0) {
        throw new Error("Invalid final amount for refund.");
      }

      const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      try {
        const paymentDetails = await razorpayInstance.payments.fetch(
          orderData.razorpayPaymentId
        );

        // Already refunded?
        if (
          paymentDetails.status === "refunded" ||
          paymentDetails.amount_refunded === paymentDetails.amount
        ) {
          return res.status(400).json({
            status: false,
            message: "This payment has already been refunded.",
          });
        }

        // Only refund if captured
        if (paymentDetails.status !== "captured") {
          return res.status(400).json({
            status: false,
            message: "Payment is not captured yet. Cannot refund.",
          });
        }

        // Refund to bank
        refundData = await razorpayInstance.payments.refund(
          orderData.razorpayPaymentId,
          {
            speed: "normal",
            notes: {
              reason: reason || "Customer Cancelled order",
            },
            receipt: `refund_receipt_order_${orderId}`,
          }
        );
      } catch (err) {
        console.error("Razorpay refund error:", JSON.stringify(err, null, 2));
        return res.status(500).json({
          status: false,
          message: "Refund to bank failed",
          error: err?.error?.description || err?.message,
        });
      }
    }

    // =========================
    // WALLET REFUND
    // =========================
    if (isPaid && !isCOD && refundMethod === "wallet") {
      const userWallet = await db.userWallet.findOne({
        where: { userId: orderData.userId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!userWallet) {
        throw new Error("User wallet not found for wallet refund.");
      }

      // Add refund amount
      userWallet.realBalance = (
        parseFloat(userWallet.realBalance) + parseFloat(orderData.finalAmount)
      ).toFixed(2);

      await userWallet.save({ transaction: t });

      // Log wallet transaction
      await db.userWalletTransaction.create(
        {
          walletId: userWallet.id,
          type: "CREDIT",
          amount: orderData.finalAmount,
          balanceType: "REAL",
          reason: "Order Refund",
          referenceId: `ORDER_REFUND_${orderId}`,
        },
        { transaction: t }
      );
    }

    // =========================
    // Reverse Seller Wallet Transactions
    // =========================
    if (isPaid && !isCOD) {
      const walletTxns = await walletTransaction.findAll({
        where: {
          razorpayPaymentId: orderData.razorpayPaymentId,
          type: "credit",
          status: "completed",
        },
        transaction: t,
      });

      for (const txn of walletTxns) {
        const sellerWallet = await wallet.findOne({
          where: { sellerId: txn.sellerId },
          transaction: t,
        });

        if (sellerWallet && sellerWallet.balance >= txn.amount) {
          await sellerWallet.decrement("balance", {
            by: txn.amount,
            transaction: t,
          });

          await walletTransaction.create(
            {
              sellerId: txn.sellerId,
              type: "debit",
              amount: txn.amount,
              reason: "Refund due to order cancellation",
              razorpayPaymentId: `REFUND_${txn.razorpayPaymentId}`,
              status: "completed",
            },
            { transaction: t }
          );
        } else {
          console.warn(
            `Insufficient balance in wallet for sellerId ${txn.sellerId}`
          );
        }
      }
    }

    // =========================
    // Update Order & Suborders
    // =========================
    await order.update(
      {
        orderStatus: "cancelled",
        paymentStatus:
          isPaid && !isCOD
            ? refundMethod === "bank"
              ? "refunded"
              : "wallet_refunded"
            : orderData.paymentStatus,
        refundId: refundData?.id || null,
        cancellationReason: reason,
      },
      { where: { id: orderId }, transaction: t }
    );

    await suborder.update(
      { orderStatus: "cancelled" },
      { where: { orderId }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      message: "Order cancelled successfully",
      refund: refundData,
      status: true,
    });
  } catch (error) {
    await t.rollback();
    console.error("Cancel order error:", error);
    return res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
      status: false,
    });
  }
};
exports.markOrderAsDelivered = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { orderId } = req.params;

    const orderData = await order.findOne({
      where: { id: orderId },
      include: [
        {
          model: orderitem,
          as: "items",
          include: [
            { model: db.product, as: "product", attributes: ["sellerId"] },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found.",
        status: false,
      });
    }

    const { paymentMethod, paymentStatus, orderStatus } = orderData;

    // 🚫 Block marking online orders as delivered if payment is still pending
    if (paymentMethod === "online" && paymentStatus === "pending") {
      return res.status(400).json({
        message:
          "Online payment is still processing. Cannot mark as delivered.",
        status: false,
      });
    }

    // ✅ For COD: allow marking as delivered and mark payment as paid
    if (paymentMethod === "cod") {
      if (orderStatus === "delivered") {
        return res.status(400).json({
          message: "Order is already marked as delivered.",
          status: false,
        });
      }

      await order.update(
        { orderStatus: "delivered", paymentStatus: "paid" },
        { where: { id: orderId }, transaction: t }
      );

      await db.suborder.update(
        { orderStatus: "delivered", paymentStatus: "paid" },
        { where: { orderId }, transaction: t }
      );

      // 1. Fetch admin fee configs (fixed and/or percentage)
      const feeConfigs = await db.adminFeeConfig.findAll({ transaction: t });

      const sellerAmounts = {};

      // 2. Calculate gross per-seller amount after discounts
      for (const item of orderData.items) {
        const sellerId = item.product?.sellerId;
        if (!sellerId) continue;

        const baseAmount = item.price * item.quantity;

        const itemDiscount = item.discountPercentage || 0; // Discount at item level
        const variantDiscount = item.variant?.discountPercentage || 0;

        const totalDiscountPercentage = itemDiscount + variantDiscount;
        const discountedAmount =
          baseAmount - (baseAmount * totalDiscountPercentage) / 100;

        sellerAmounts[sellerId] =
          (sellerAmounts[sellerId] || 0) + discountedAmount;
      }

      // 3. Apply coupon (if applied)
      if (orderData.coupon && orderData.coupon.amount > 0) {
        // Equally divide the coupon among sellers
        const totalSellerCount = Object.keys(sellerAmounts).length;
        const couponShare = orderData.coupon.amount / totalSellerCount;

        for (const sellerId in sellerAmounts) {
          sellerAmounts[sellerId] -= couponShare;
        }
      }

      // 4. Distribute amounts to sellers after admin fee deduction
      for (const sellerId in sellerAmounts) {
        const grossAmount = sellerAmounts[sellerId];
        let platformFee = 0;

        for (const fee of feeConfigs) {
          if (fee.amountType === "percentage") {
            platformFee += (grossAmount * fee.amountValue) / 100;
          } else {
            platformFee += fee.amountValue;
          }
        }

        const netAmount = parseFloat((grossAmount - platformFee).toFixed(2));

        // 5. Add net amount to seller's wallet
        await db.wallet.increment("balance", {
          by: netAmount,
          where: { sellerId },
          transaction: t,
        });

        // 6. Log the transaction
        await db.walletTransaction.create(
          {
            sellerId,
            type: "credit",
            amount: netAmount,
            reason: "COD order delivered",
            status: "completed",
            orderId,
          },
          { transaction: t }
        );
      }

      await t.commit();
      return res.status(200).json({
        message: "COD order marked as delivered and seller credited.",
        status: true,
      });
    }

    // ✅ For online: allow marking as delivered only if paid
    if (paymentMethod === "online" && paymentStatus === "paid") {
      await order.update(
        { orderStatus: "delivered" },
        { where: { id: orderId }, transaction: t }
      );

      await db.suborder.update(
        { orderStatus: "delivered" },
        { where: { orderId }, transaction: t }
      );

      await t.commit();
      return res.status(200).json({
        message: "Online order marked as delivered.",
        status: true,
      });
    }

    // 🚫 Fallback for all other cases
    return res.status(400).json({
      message: "Order cannot be marked as delivered under current status.",
      status: false,
    });
  } catch (error) {
    await t.rollback();
    console.error("Mark Delivered Error:", error);
    return res.status(500).json({
      message: "Failed to mark order as delivered.",
      error: error.message,
      status: false,
    });
  }
};

exports.addOrderCustomisation = async (req, res) => {
  try {
    const { orderId, productId, customData } = req.body;

    // Validate customData
    if (!customData || typeof customData !== "object") {
      return res.status(400).json({ message: "Invalid custom data" });
    }

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optional: check if product actually belongs to this order

    // Save customisation
    const saved = await OrderCustomisation.create({
      orderId,
      productId,
      customData,
    });

    return res.status(201).json({
      status: true,
      message: "Customisation saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.getCustomisationsOrderbySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res
        .status(400)
        .json({ status: false, message: "Seller ID is required" });
    }

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const customisations = await OrderCustomisation.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId },
        },
        {
          model: Order,
          as: "order",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = customisations.map((item) => {
      const product = item.product?.toJSON();

      if (product?.mainImage) {
        product.mainImage = hostUrl + product.mainImage;
      }

      if (product?.images) {
        // Handle images safely if stored as array, JSON, or comma-separated string
        if (Array.isArray(product.images)) {
          product.images = product.images.map((img) => hostUrl + img);
        } else {
          try {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed)) {
              product.images = parsed.map((img) => hostUrl + img);
            } else {
              product.images = [hostUrl + parsed];
            }
          } catch {
            product.images = product.images
              .toString()
              .split(",")
              .map((img) => hostUrl + img.trim());
          }
        }
      }

      return {
        ...item.toJSON(),
        product,
      };
    });

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    console.error("Error in getCustomisationsOrderbySellerId:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.createOrder = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const {
      userId,
      items,
      shippingAddressId,
      paymentMethod,
      couponCode,
      isCoin,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required." });
    }

    const address1 = await address.findByPk(shippingAddressId);
    if (!address1) {
      return res.status(400).json({ message: "Invalid address selected." });
    }

    const itemsBySeller = {};
    let totalAmount = 0;
    let totalWeight = 0;
    let totalPrepaidDiscount = 0;

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      const product = await db.product.findByPk(productId);
      if (!product) throw new Error(`Product ${productId} not found`);

      const variantRec = variantId
        ? await db.variant.findByPk(variantId)
        : null;

      const basePrice = variantRec?.price ?? product.price;
      const weight = variantRec?.weight ?? product.weight ?? 0;
      const discountPercent =
        variantRec?.discountPercent ?? product.discountPercent ?? 0;
      const discountPerUnit = (basePrice * discountPercent) / 100;
      const finalPrice = basePrice - discountPerUnit;

      const itemTotal = finalPrice * quantity;
      const itemWeight = weight * quantity;
      const totalProductDiscount = discountPerUnit * quantity;

      totalAmount += itemTotal;
      totalWeight += itemWeight;

      const sellerId = product.sellerId;
      if (!itemsBySeller[sellerId]) itemsBySeller[sellerId] = [];

      let prepaidDiscount = 0;
      if (paymentMethod === "online") {
        const prepaidType =
          variantRec?.prepaidDiscountType || product.prepaidDiscountType;
        const prepaidValue =
          variantRec?.prepaidDiscountValue ?? product.prepaidDiscountValue ?? 0;

        if (prepaidType === "percentage") {
          prepaidDiscount = (finalPrice * prepaidValue) / 100;
        } else if (prepaidType === "fixed") {
          prepaidDiscount = prepaidValue;
        }

        if (prepaidDiscount > finalPrice) prepaidDiscount = finalPrice;
        totalPrepaidDiscount += prepaidDiscount * quantity;
      }

      itemsBySeller[sellerId].push({
        productId,
        variantId,
        quantity,
        basePrice,
        discountPercent,
        productDiscount: totalProductDiscount,
        finalPrice,
        prepaidDiscount,
      });

      item.price = finalPrice;
      item.subCategoryId = product.subCategoryId;
      item.categoryId = product.categoryId;
      item.mainCategoryId = product.mainCategoryId;
    }

    const shippingFee = await exports.calculateShippingFee({
      db,
      totalAmount,
      address: address1,
      totalWeight,
    });

    const { discount, message } = await exports.validateCoupon({
      couponCode,
      totalAmount,
      userId,
      db,
      cartItems: items,
    });
    if (message) console.log("Coupon message:", message);

    const finalAmountBeforePrepaid = Math.max(
      0,
      totalAmount - discount + shippingFee
    );
    let finalAmount = Math.max(
      0,
      finalAmountBeforePrepaid - totalPrepaidDiscount
    );

    const totalProductDiscount = Object.values(itemsBySeller)
      .flat()
      .reduce((sum, item) => sum + item.productDiscount, 0);

    const newOrder = await db.order.create(
      {
        userId,
        shippingAddressId,
        totalAmount,
        shippingFee,
        finalAmount,
        paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        discount: totalProductDiscount,
        couponDiscount: discount,
        prepaidDiscount: totalPrepaidDiscount,
      },
      { transaction: t }
    );

    const allOrderItems = [];

    for (const sellerId in itemsBySeller) {
      const sellerItems = itemsBySeller[sellerId];
      let subTotal = 0;

      sellerItems.forEach((item) => {
        subTotal += item.finalPrice * item.quantity;
      });

      const proportion = subTotal / totalAmount;
      const subDiscount = parseFloat((discount * proportion).toFixed(2));
      const subShippingFee = parseFloat((shippingFee * proportion).toFixed(2));
      const subFinalAmount = parseFloat(
        (subTotal - subDiscount + subShippingFee).toFixed(2)
      );

      const subOrder = await db.suborder.create(
        {
          orderId: newOrder.id,
          sellerId,
          subTotal,
          discount: subDiscount,
          shippingFee: subShippingFee,
          finalAmount: subFinalAmount,
          status: "placed",
          paymentMethod,
        },
        { transaction: t }
      );

      sellerItems.forEach((item) => {
        allOrderItems.push({
          orderId: newOrder.id,
          subOrderId: subOrder.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          price: item.finalPrice,
          productDiscount: item.productDiscount,
          sellerId: parseInt(sellerId),
        });
      });
    }
    await db.orderitem.bulkCreate(allOrderItems, {
      ignoreDuplicates: true,
      transaction: t,
    });

    // ✅ FIX: sort items before locking to avoid deadlock
    allOrderItems.sort((a, b) => a.productId - b.productId);

    for (const item of allOrderItems) {
      if (item.variantId) {
        // ✅ Use raw query with SKIP LOCKED to avoid lock wait timeout
        const variantRecord = await db.variant.findOne({
          where: { id: item.variantId, productId: item.productId },
          include: [
            { model: db.product, as: "product", attributes: ["title"] },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!variantRecord) {
          throw new Error(
            `Variant not found (Product ID: ${item.productId}, Variant ID: ${item.variantId}).`
          );
        }
        if (variantRecord.stock < item.quantity) {
          throw new Error(
            `Sorry, ${
              !variantRecord.stock
                ? "the item is not available"
                : `only ${variantRecord.stock} units`
            } of "${
              variantRecord.product?.title || `Product ID: ${item.productId}`
            }" are available. You requested ${item.quantity}.`
          );
        }
        variantRecord.stock -= item.quantity;
        await variantRecord.save({ transaction: t });
      } else {
        const productRecord = await db.product.findOne({
          where: { id: item.productId, sellerId: item.sellerId },
          transaction: t,
          lock: t.LOCK.UPDATE,
          skipLocked: true,
        });

        if (!productRecord)
          throw new Error(`Product not found (ID: ${item.productId}).`);
        if (productRecord.stock < item.quantity) {
          throw new Error(
            `Sorry, only ${productRecord.stock} units of "${productRecord.title}" are available. You requested ${item.quantity}.`
          );
        }
        productRecord.stock -= item.quantity;
        await productRecord.save({ transaction: t });
      }
    }
    if (isCoin) {
      const coinRecord = await db.coin.findOne({
        where: { userId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!coinRecord || coinRecord.balance <= 0) {
        throw new Error("Insufficient coin balance.");
      }

      // rule: 1 coin = ₹1 (you can modify this)
      let coinsToUse = Math.min(coinRecord.balance, finalAmount);

      // deduct coins
      coinRecord.balance -= coinsToUse;
      await coinRecord.save({ transaction: t });

      // transaction log
      await db.coinTransaction.create(
        {
          userId,
          actionType: "ORDER_PAYMENT",
          coins: coinsToUse,
          transactionType: "DEBIT",
          description: `Coins used for Order #${newOrder.id}`,
        },
        { transaction: t }
      );

      // reduce payable final amount
      finalAmount -= coinsToUse;

      // update order
      newOrder.coinUsed = coinsToUse;
      newOrder.finalAmount = finalAmount;
      await newOrder.save({ transaction: t });
    }

    // Wallet payment handling (unchanged)
    if (paymentMethod === "wallet" || paymentMethod === "wallet+online") {
      const wallet = await db.userWallet.findOne({
        where: { userId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!wallet) {
        return res
          .status(400)
          .json({ message: "Wallet not found", status: false });
      }

      let promoBalance = parseFloat(wallet.promoBalance || 0);
      let realBalance = parseFloat(wallet.realBalance || 0);

      // ✅ Wallet only: Check if sufficient total balance
      if (
        paymentMethod === "wallet" &&
        promoBalance + realBalance < finalAmount
      ) {
        return res
          .status(400)
          .json({ message: "Insufficient wallet balance", status: false });
      }

      let amountRemaining = finalAmount;
      let promoUsed = 0,
        realUsed = 0;

      // 🔹 First use promo balance
      if (promoBalance > 0) {
        promoUsed = Math.min(promoBalance, amountRemaining);
        amountRemaining -= promoUsed;
      }

      // 🔹 Then use real balance
      if (amountRemaining > 0 && realBalance > 0) {
        realUsed = Math.min(realBalance, amountRemaining);
        amountRemaining -= realUsed;
      }

      newOrder.walletPromoPending = promoUsed;
      newOrder.walletRealPending = realUsed;

      // ================= PURE WALLET CASE =================
      if (paymentMethod === "wallet") {
        if (amountRemaining <= 0) {
          // Deduct immediately
          wallet.promoBalance -= promoUsed;
          wallet.realBalance -= realUsed;
          await wallet.save({ transaction: t });

          const transactions = [];
          if (promoUsed > 0) {
            transactions.push({
              walletId: wallet.id,
              userId,
              type: "DEBIT",
              amount: promoUsed,
              source: "ORDER",
              balanceType: "PROMO",
              reason: `Promo balance used for Order #${newOrder.id}`,
            });
          }
          if (realUsed > 0) {
            transactions.push({
              walletId: wallet.id,
              userId,
              type: "DEBIT",
              amount: realUsed,
              source: "ORDER",
              balanceType: "REAL",
              reason: `Real balance used for Order #${newOrder.id}`,
            });
          }

          if (transactions.length > 0) {
            await db.userWalletTransaction.bulkCreate(transactions, {
              transaction: t,
            });
          }

          newOrder.paymentStatus = "paid";
          finalAmount = 0;
        }
      }

      // ================= WALLET + ONLINE CASE =================
      else if (paymentMethod === "wallet+online") {
        if (amountRemaining <= 0) {
          // ✅ Wallet fully covers order
          wallet.promoBalance -= promoUsed;
          wallet.realBalance -= realUsed;
          await wallet.save({ transaction: t });

          const transactions = [];
          if (promoUsed > 0) {
            transactions.push({
              walletId: wallet.id,
              userId,
              type: "DEBIT",
              amount: promoUsed,
              source: "ORDER",
              description: `Promo balance used for Order #${newOrder.id}`,
            });
          }
          if (realUsed > 0) {
            transactions.push({
              walletId: wallet.id,
              userId,
              type: "DEBIT",
              amount: realUsed,
              source: "ORDER",
              description: `Real balance used for Order #${newOrder.id}`,
            });
          }

          if (transactions.length > 0) {
            await db.userWalletTransaction.bulkCreate(transactions, {
              transaction: t,
            });
          }

          newOrder.paymentStatus = "paid";
          finalAmount = 0;
        } else {
          // ✅ Partial wallet, remaining goes to Razorpay
          newOrder.paymentStatus = "pending";
          finalAmount = amountRemaining;
        }
      }

      await newOrder.save({ transaction: t });
    }

    await t.commit();

    let razorpayOrder = null;
    if (
      (paymentMethod === "online" || paymentMethod === "wallet+online") &&
      finalAmount > 0
    ) {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: parseInt(finalAmount * 100),
        currency: "INR",
        receipt: `rcpt_${newOrder.id}`,
        notes: { orderId: newOrder.id.toString(), userId: userId.toString() },
      });

      await db.order.update(
        { razorpayOrderId: razorpayOrder.id },
        { where: { id: newOrder.id } }
      );
    }

    if (couponCode && discount > 0) {
      const coupon = await db.coupon.findOne({
        where: { code: couponCode, status: "active" },
      });
      if (coupon) {
        const [usage, created] = await db.couponusage.findOrCreate({
          where: { couponId: coupon.id, userId },
          defaults: { usageCount: 1 },
        });
        if (!created) {
          usage.usageCount += 1;
          await usage.save();
        }
      }
    }

    sendOrderEmails({
      orderId: newOrder.id,
      userId,
      itemsBySeller,
      finalAmount,
    });

    //send the push notification
    try {
      for (const sellerId in itemsBySeller) {
        const tokens = (
          await FcmToken.findAll({
            where: { userId: sellerId, userType: "seller" },
          })
        )
          .map((r) => r.token)
          .filter(Boolean);
        if (tokens.length) {
          const send = await sendToMany(
            tokens,
            {
              title: "New Order Received",
              body: `Order #${newOrder.id} placed. Tap to view details.`,
            },
            {
              orderId: String(newOrder.id),
              type: "ORDER_PLACED",
              userType: "seller",
              redirectUrl: "/seller/orders",
            }
          );
        }
      }
    } catch (notifyErr) {
      console.error("FCM Notification Error:", notifyErr);
    }

    return res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder.id,
      discount: parseFloat(discount).toFixed(2),
      shippingFee: parseFloat(shippingFee).toFixed(2),
      finalAmount: parseFloat(finalAmount).toFixed(2),
      paymentMethod,
      razorpayOrderId: razorpayOrder?.id || null,
      razorpayKeyId:
        paymentMethod === "online" ||
        (paymentMethod === "wallet+online" && finalAmount > 0)
          ? process.env.RAZORPAY_KEY_ID
          : null,
      status: true,
      prepaidDiscount: totalPrepaidDiscount.toFixed(2),
    });
  } catch (error) {
    await t.rollback();
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
      status: false,
    });
  }
};

// 🔹 Calculate platform fee
async function calculatePlatformFee(subOrder, transaction) {
  const feeConfigs = await db.adminFeeConfig.findAll({ transaction });
  const grossAmount = parseFloat(subOrder.finalAmount);
  let platformFee = 0;

  for (const fee of feeConfigs) {
    if (fee.amountType === "percentage") {
      platformFee += (grossAmount * fee.amountValue) / 100;
    } else {
      platformFee += fee.amountValue;
    }
  }

  const netAmount = parseFloat((grossAmount - platformFee).toFixed(2));
  return { grossAmount, platformFee, netAmount };
}

// 🔹 Handle seller wallet update
async function creditSellerWallet(
  { sellerId, netAmount, suborderId, orderId, paymentMethod },
  transaction
) {
  await db.wallet.increment("balance", {
    by: netAmount,
    where: { sellerId },
    transaction,
  });

  await db.walletTransaction.create(
    {
      sellerId,
      type: "credit",
      amount: netAmount,
      reason: `${paymentMethod} suborder delivered`,
      status: "completed",
      suborderId,
      orderId,
    },
    { transaction }
  );
}

// 🔹 Apply cashback rules
async function applyCashback(
  { order, suborderId, grossAmount, paymentMethod },
  transaction
) {
  const cashbackRules = await db.cashbackRule.findAll({
    where: { isActive: true },
    transaction,
  });

  const userId = order.userId;
  const subOrderItems = await db.orderitem.findAll({
    where: { suborderId },
    transaction,
  });

  let totalCashback = 0;

  for (const rule of cashbackRules) {
    if (rule.startDate && new Date() < new Date(rule.startDate)) continue;
    if (rule.endDate && new Date() > new Date(rule.endDate)) continue;
    if (
      rule.minPurchaseAmount &&
      grossAmount < parseFloat(rule.minPurchaseAmount)
    )
      continue;

    if (
      rule.paymentMethods &&
      Array.isArray(rule.paymentMethods) &&
      !rule.paymentMethods.includes(paymentMethod)
    )
      continue;

    if (
      rule.applicableCategories &&
      Array.isArray(rule.applicableCategories) &&
      rule.applicableCategories.length > 0
    ) {
      let applicableCategoryFound = false;
      for (const item of subOrderItems) {
        const product = await db.product.findByPk(item.productId, {
          transaction,
        });
        if (
          product &&
          rule.applicableCategories
            .map(Number)
            .includes(Number(product.categoryId))
        ) {
          applicableCategoryFound = true;
          break;
        }
      }
      if (!applicableCategoryFound) continue;
    }

    if (
      rule.applicableProducts &&
      Array.isArray(rule.applicableProducts) &&
      rule.applicableProducts.length > 0
    ) {
      let applicableProductFound = false;
      for (const item of subOrderItems) {
        if (
          rule.applicableProducts.map(Number).includes(Number(item.productId))
        ) {
          applicableProductFound = true;
          break;
        }
      }
      if (!applicableProductFound) continue;
    }

    let cashbackAmount = 0;
    if (rule.cashbackType === "percentage")
      cashbackAmount = (grossAmount * parseFloat(rule.cashbackValue)) / 100;
    else if (rule.cashbackType === "fixed")
      cashbackAmount = parseFloat(rule.cashbackValue);

    if (cashbackAmount > 0) {
      totalCashback += cashbackAmount;
      let expiryDate = null;
      if (rule.expiryDays) {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + rule.expiryDays);
      }

      await db.cashback.create(
        {
          userId,
          orderId: order.id,
          suborderId,
          cashbackRuleId: rule.id,
          amount: cashbackAmount.toFixed(2),
          status: "approved",
          expiryDate,
        },
        { transaction }
      );
    }
  }

  // Update User Wallet
  if (totalCashback > 0) {
    // Update or Create User Wallet
    let userWallet = await db.userWallet.findOne({
      where: { userId },
      transaction,
    });

    if (!userWallet) {
      userWallet = await db.userWallet.create(
        {
          userId,
          realBalance: 0,
          promoBalance: parseFloat(totalCashback.toFixed(2)),
        },
        { transaction }
      );
    } else {
      await db.userWallet.update(
        {
          promoBalance: parseFloat(
            (parseFloat(userWallet.promoBalance || 0) + totalCashback).toFixed(
              2
            )
          ),
        },
        { where: { id: userWallet.id }, transaction }
      );

      userWallet = await db.userWallet.findByPk(userWallet.id, { transaction });
    }

    const tr = await db.userWalletTransaction.create(
      {
        walletId: userWallet.id,
        userId,
        type: "CREDIT",
        amount: parseFloat(totalCashback.toFixed(2)),
        balanceType: "PROMO",
        reason: "Cashback credited on order delivery",
        referenceId: `ORDER_${order.id}`,
      },
      { transaction }
    );
  }
}

// 🔹 Main Controller
exports.markSuborderAsDelivered = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { suborderId, sellerId } = req.body;

    const subOrder = await db.suborder.findOne({
      where: { id: suborderId, sellerId },
      include: [
        {
          model: db.order,
          as: "order",
          include: [{ model: db.user, as: "user" }],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!subOrder) {
      await t.rollback();
      return res.status(404).json({
        message: "Suborder not found or not associated with seller.",
        status: false,
      });
    }

    if (subOrder.orderStatus === "delivered") {
      await t.rollback();
      return res.status(400).json({
        message: "Suborder already marked as delivered.",
        status: false,
      });
    }

    const { paymentMethod, paymentStatus, order } = subOrder;

    if (paymentMethod === "online" && paymentStatus === "pending") {
      await t.rollback();
      return res.status(400).json({
        message: "Online payment still pending. Cannot mark as delivered.",
        status: false,
      });
    }

    const isCOD = paymentMethod === "cod";

    await db.suborder.update(
      {
        orderStatus: "delivered",
        ...(isCOD && { paymentStatus: "paid" }),
      },
      { where: { id: suborderId }, transaction: t }
    );

    const remainingSuborders = await db.suborder.count({
      where: {
        orderId: subOrder.orderId,
        orderStatus: { [db.Sequelize.Op.ne]: "delivered" },
      },
      transaction: t,
    });

    if (remainingSuborders === 0) {
      await db.order.update(
        { orderStatus: "delivered", paymentStatus: "paid" },
        { where: { id: subOrder.orderId }, transaction: t }
      );
    }

    // 🔹 Calculate Fees
    const { grossAmount, netAmount } = await calculatePlatformFee(subOrder, t);
    await creditSellerWallet(
      {
        sellerId,
        netAmount,
        suborderId,
        orderId: subOrder.orderId,
        paymentMethod,
      },
      t
    );

    // 🔹 Apply Cashback
    await applyCashback({ order, suborderId, grossAmount, paymentMethod }, t);

    // 🔹 Apply Coins
    const coinsEarned = await applyCoinRule({
      userId: order.userId,
      actionType: "order_placed",
      amount: grossAmount,
      referenceId: `SUBORDER_${suborderId}`,
      transaction: t,
    });

    if (coinsEarned) {
      console.log(
        `User ${order.userId} earned ${coinsEarned} coins for this order.`
      );
    }

    await t.commit();
    return res.status(200).json({
      message:
        "Suborder marked as delivered, wallet and cashback updated successfully.",
      status: true,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Failed to mark suborder as delivered.",
      error: error.message,
      status: false,
    });
  }
};

exports.cancelUnpaidOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { orderId, userId } = req.body;

    // 1. Fetch order with suborders + items
    const existingOrder = await order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: suborder,
          as: "suborders",
          include: [{ model: orderitem, as: "items" }],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE, // 🔹 Lock the row to prevent race conditions
    });

    if (!existingOrder) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Order not found", status: false });
    }

    // Prevent double cancellation
    if (existingOrder.orderStatus === "processing") {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Order already processing", status: false });
    }

    // 2. Cancel order + suborders
    await existingOrder.update(
      { orderStatus: "processing" },
      { transaction: t }
    );

    for (const sub of existingOrder.suborders) {
      await sub.update({ orderStatus: "processing" }, { transaction: t });

      // 3. Inventory rollback
      for (const item of sub.items) {
        if (item.variantId) {
          // Variant stock rollback
          await variant.increment("stock", {
            by: item.quantity,
            where: { id: item.variantId },
            transaction: t,
          });
        } else {
          // Product stock rollback
          await product.increment("stock", {
            by: item.quantity,
            where: { id: item.productId },
            transaction: t,
          });
        }
      }
    }
    // 4. Coins reverse
    if (existingOrder.coinUsed && existingOrder.coinUsed > 0) {
      await coin.increment("balance", {
        by: existingOrder.coinUsed,
        where: { userId },
        transaction: t,
      });

      // 5. CoinTransaction entry
      await coinTransaction.create(
        {
          userId,
          orderId: existingOrder.id,
          coins: existingOrder.coinUsed,
          transactionType: "CREDIT",
          description: "ORDER_CANCELLED",
          actionType: "Refund coin",
        },
        { transaction: t }
      );
    }

    await t.commit();
    return res
      .status(200)
      .json({ message: "Order cancelled successfully", status: true });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
      status: false,
    });
  }
};
