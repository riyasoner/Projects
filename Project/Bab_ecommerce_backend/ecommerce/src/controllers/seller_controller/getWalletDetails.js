// controllers/wallet.controller.js

const db = require("../../../config/config");

const Wallet = db.wallet;

exports.getWalletSummary = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        status: false,
        message: "Seller ID is required.",
      });
    }

    const wallet = await Wallet.findOne({ where: { sellerId } });

    if (!wallet) {
      return res.status(404).json({
        status: false,
        message: "Wallet not found for the seller.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Wallet summary fetched successfully.",
      data: {
        balance: wallet.balance,
        withdrawnAmount: wallet.withdrawnAmount,
        pendingBalance: wallet.pending_balance,
        currency: wallet.currency,
        lastUpdated: wallet.last_updated,
      },
    });
  } catch (error) {
    console.error("Get wallet summary error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
