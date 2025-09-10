const db = require("../../../config/config");
const Cashback = db.cashback;
const CashbackRule = db.cashbackRule;
const UserWalletTransaction = db.userWalletTransaction;

const getCashbackHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "User ID is required",
      });
    }

    // Fetch cashback transactions with rule details
    const cashbackHistory = await Cashback.findAll({
      where: { userId },
      include: [
        {
          model: CashbackRule,
          as: "cashbackRule",
        },
      ],
      order: [["id", "DESC"]],
    });

    // Fetch wallet transaction history (optional if you want full picture)
    const walletTransactions = await UserWalletTransaction.findAll({
      where: { userId, balanceType: "PROMO" },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Cashback history fetched successfully",
      data: {
        cashbackHistory,
        walletTransactions,
      },
    });
  } catch (error) {
    console.error("Error fetching cashback history:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching cashback history",
    });
  }
};

module.exports = {
  getCashbackHistory,
};
