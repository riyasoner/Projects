const crypto = require("crypto");
const db = require("../../../config/config");
const {
  order,
  orderitem,
  product,
  wallet,
  walletTransaction,
  adminFeeConfig,
  sequelize,
} = db;

exports.razorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const razorpaySignature = req.headers["x-razorpay-signature"];
  const rawBody = req.body; // already a buffer if middleware is correct

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    return res
      .status(400)
      .json({ message: "Invalid signature", status: false });
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const event = payload.event;

  const t = await sequelize.transaction(); // 🔁
  try {
    switch (event) {
      case "payment.captured": {
        const payment = payload.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const existingOrder = await order.findOne({
          where: { razorpayOrderId },
          transaction: t,
        });

        if (!existingOrder) break;
        if (existingOrder.paymentStatus === "paid") break;

        // Get items
        const items = await orderitem.findAll({
          where: { orderId: existingOrder.id },
          include: [
            { model: product, as: "product", attributes: ["id", "sellerId"] },
          ],
          transaction: t,
        });

        if (!items.length) break;

        const feeConfigs = await adminFeeConfig.findAll({ transaction: t });

        const sellerEarnings = {};

        for (const item of items) {
          const productInfo = item.product;
          if (!productInfo || !productInfo.sellerId) continue;

          const sellerId = productInfo.sellerId;
          const itemAmount = parseFloat(item.price) * item.quantity;

          if (!sellerEarnings[sellerId]) sellerEarnings[sellerId] = 0;
          sellerEarnings[sellerId] += itemAmount;
        }

        for (const sellerId in sellerEarnings) {
          const gross = sellerEarnings[sellerId];
          let platformFee = 0;

          for (const fee of feeConfigs) {
            if (fee.amountType === "percentage") {
              platformFee += (gross * fee.amountValue) / 100;
            } else {
              platformFee += fee.amountValue;
            }
          }

          const sellerAmount = parseFloat((gross - platformFee).toFixed(2));

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
              type: "credit",
              amount: sellerAmount,
              reason: "sale",
              reference_id: payment.id,
              status: "completed",
            },
            { transaction: t }
          );
        }

        await existingOrder.update(
          {
            paymentStatus: "paid",
            razorpayPaymentId: payment.id,
            paymentMethod: "razorpay",
          },
          { transaction: t }
        );

        console.log(
          `✅ Payment credited via webhook for Order ID: ${existingOrder.id}`
        );
        break;
      }

      case "payment.failed": {
        const payment = payload.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const existingOrder = await order.findOne({
          where: { razorpayOrderId },
          transaction: t,
        });
        if (existingOrder && existingOrder.paymentStatus !== "failed") {
          await existingOrder.update(
            { paymentStatus: "failed" },
            { transaction: t }
          );
          console.warn(`❌ Payment failed for Order ID: ${existingOrder.id}`);
        }
        break;
      }

      case "refund.processed": {
        const refund = payload.payload.refund.entity;
        console.log(
          `🔁 Refund of ₹${refund.amount / 100} processed, refund ID: ${
            refund.id
          }`
        );
        break;
      }

      default:
        console.log(`⚠️ Unhandled event: ${event}`);
        break;
    }

    await t.commit();
    return res.status(200).json({ message: "Webhook received", status: true });
  } catch (error) {
    await t.rollback();
    console.error("Webhook error:", error.message);
    return res.status(500).json({ message: "Server error", status: false });
  }
};
