const crypto = require("crypto");
const db = require("../../../config/config");
const {
  order,
  orderitem,
  product,
  wallet,
  walletTransaction,
  adminFeeConfig,
  sequelize, // ⬅️ used for transaction
  userWallet,
  userWalletTransaction,
} = db;

exports.verifyRazorpayPayment = async (req, res) => {
  const t = await sequelize.transaction(); // transaction
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;

    // 1. ✅ Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Invalid payment signature",
        status: false,
      });
    }

    // 2. ✅ Find the order
    const currentOrder = await order.findOne({
      where: { id: orderId, razorpayOrderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!currentOrder) {
      return res
        .status(404)
        .json({ message: "Order not found", status: false });
    }

    if (currentOrder.paymentStatus === "paid") {
      return res.status(200).json({
        message: "Payment already processed",
        status: true,
      });
    }

    // 3. ✅ Deduct wallet if pending
    if (
      (currentOrder.walletPromoPending > 0 ||
        currentOrder.walletRealPending > 0) &&
      currentOrder.userId
    ) {
      const userWalletRecord = await userWallet.findOne({
        where: { userId: currentOrder.userId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!userWalletRecord) {
        throw new Error("User wallet not found while deducting pending amount");
      }

      // Prevent negative balances
      if (
        currentOrder.walletPromoPending > 0 &&
        userWalletRecord.promoBalance < currentOrder.walletPromoPending
      ) {
        throw new Error("Insufficient promo balance");
      }
      if (
        currentOrder.walletRealPending > 0 &&
        userWalletRecord.realBalance < currentOrder.walletRealPending
      ) {
        throw new Error("Insufficient real balance");
      }

      // Deduct balances
      if (currentOrder.walletPromoPending > 0) {
        userWalletRecord.promoBalance -= currentOrder.walletPromoPending;
      }
      if (currentOrder.walletRealPending > 0) {
        userWalletRecord.realBalance -= currentOrder.walletRealPending;
      }
      await userWalletRecord.save({ transaction: t });

      // Create wallet transactions
      const transactions = [];
      if (currentOrder.walletPromoPending > 0) {
        transactions.push({
          walletId: userWalletRecord.id,
          userId: currentOrder.userId,
          type: "DEBIT",
          amount: currentOrder.walletPromoPending,
          balanceType: "PROMO",
          referenceId: "ORDER",
          reason: `Promo balance used for Order #${currentOrder.id}`,
          status: "completed",
        });
      }
      if (currentOrder.walletRealPending > 0) {
        transactions.push({
          walletId: userWalletRecord.id,
          userId: currentOrder.userId,
          type: "DEBIT",
          amount: currentOrder.walletRealPending,
          balanceType: "REAL",
          referenceId: "ORDER",
          reason: `Real balance used for Order #${currentOrder.id}`,
          status: "completed",
        });
      }

      if (transactions.length > 0) {
        await walletTransaction.bulkCreate(transactions, { transaction: t });
      }
    }

    // 4. ✅ Get order items with product & seller info
    const items = await orderitem.findAll({
      where: { orderId },
      include: [
        {
          model: product,
          as: "product",
          attributes: ["id", "sellerId"],
        },
      ],
      transaction: t,
    });

    if (!items.length) {
      return res.status(400).json({ message: "No items in this order" });
    }

    // 5. ✅ Fetch admin fee configs
    const feeConfigs = await adminFeeConfig.findAll({ transaction: t });

    // 6. ✅ Group earnings per seller
    const sellerEarnings = {};

    for (const item of items) {
      const productInfo = item.product;
      if (!productInfo || !productInfo.sellerId) continue;

      const sellerId = productInfo.sellerId;
      const itemAmount = Number(item.price || 0) * Number(item.quantity || 0);

      if (!itemAmount || isNaN(itemAmount)) continue;

      if (!sellerEarnings[sellerId]) sellerEarnings[sellerId] = 0;
      sellerEarnings[sellerId] += itemAmount;
    }

    // 7. ✅ Loop over sellers and credit wallet
    for (const sellerId in sellerEarnings) {
      const grossAmount = sellerEarnings[sellerId];
      let platformFee = 0;

      for (const fee of feeConfigs) {
        if (fee.amountType === "percentage") {
          platformFee += (grossAmount * fee.amountValue) / 100;
        } else {
          platformFee += fee.amountValue;
        }
      }

      const sellerAmount = parseFloat((grossAmount - platformFee).toFixed(2));

      const [sellerWallet] = await wallet.findOrCreate({
        where: { sellerId },
        defaults: { balance: 0 },
        transaction: t,
      });

      await sellerWallet.increment("balance", {
        by: sellerAmount,
        transaction: t,
      });

      await walletTransaction.create(
        {
          sellerId,
          type: "CREDIT",
          amount: sellerAmount,
          reason: "sale",
          razorpayPaymentId,
          status: "completed",
        },
        { transaction: t }
      );
    }

    // 8. ✅ Mark order as paid + reset pending wallet deductions
    await currentOrder.update(
      {
        paymentStatus: "paid",
        razorpayPaymentId,
        walletPromoPending: 0,
        walletRealPending: 0,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      message:
        "Payment verified, wallet deducted, sellers credited, and order updated",
      status: true,
    });
  } catch (error) {
    await t.rollback();
    console.error("Verify payment error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      status: false,
    });
  }
};
