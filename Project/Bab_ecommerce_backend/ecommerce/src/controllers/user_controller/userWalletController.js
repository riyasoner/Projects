const db = require("../../../config/config");
const userWallet = db.userWallet;
const razorpay = require("../../../config/razorpay");
const crypto = require("crypto");

const getUserWallet = async (req, res) => {
  try {
    const wallet = await userWallet.findOne({
      where: { userId: req.params.id },
    });

    if (!wallet) {
      return res.status(200).json({
        status: false,
        message: "Wallet not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
// POST /wallet/credit
const creditWallet = async (req, res) => {
  const { userId, amount, balanceType, reason, referenceId } = req.body;

  const wallet = await userWallet.findOne({ where: { userId } });

  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  if (balanceType === "REAL") {
    wallet.realBalance += parseFloat(amount);
  } else {
    wallet.promoBalance += parseFloat(amount);
  }

  wallet.lastUpdated = new Date();
  await wallet.save();

  // Record transaction
  await walletTransaction.create({
    walletId: wallet.id,
    type: "CREDIT",
    amount,
    balanceType,
    reason,
    referenceId,
  });

  res.json({ message: "Wallet credited successfully", wallet });
};
// POST /wallet/debit
const debitWallet = async (req, res) => {
  const { userId, amount, balanceType, reason, referenceId } = req.body;

  const wallet = await userWallet.findOne({ where: { userId } });

  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  if (balanceType === "REAL" && wallet.realBalance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }
  if (balanceType === "PROMO" && wallet.promoBalance < amount) {
    return res.status(400).json({ message: "Insufficient promo balance" });
  }

  if (balanceType === "REAL") {
    wallet.realBalance -= parseFloat(amount);
  } else {
    wallet.promoBalance -= parseFloat(amount);
  }

  wallet.lastUpdated = new Date();
  await wallet.save();

  // Record transaction
  await walletTransaction.create({
    walletId: wallet.id,
    type: "DEBIT",
    amount,
    balanceType,
    reason,
    referenceId,
  });

  res.json({ message: "Wallet debited successfully", wallet });
};
// POST /wallet/add-money/order

const createAddMoneyOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `wallet_rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      status: true,
      key_id: process.env.RAZORPAY_KEY_ID, // frontend ke liye key_id bhej rahe hain
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyAddMoneyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !amount
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: false,
        message: "Invalid payment signature",
      });
    }

    const wallet = await userWallet.findOne({ where: { userId } });
    if (!wallet) {
      return res
        .status(404)
        .json({ status: false, message: "Wallet not found" });
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ status: false, message: "Invalid amount" });
    }

    wallet.realBalance = parseFloat(wallet.realBalance || 0) + amountNumber;
    await wallet.save();

    return res.status(200).json({
      status: true,
      message: "Money added to wallet successfully",
      walletBalance: wallet.realBalance,
    });
  } catch (error) {
    console.error("Add Money Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { getUserWallet, createAddMoneyOrder, verifyAddMoneyPayment };
