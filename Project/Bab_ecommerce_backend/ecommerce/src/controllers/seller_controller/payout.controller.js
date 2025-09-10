const db = require("../../../config/config");
const payoutRequest = db.payoutRequest;
const OwnerWallet = db.wallet;
const WalletTransaction = db.walletTransaction;
const sequelize = db.sequelize;
// Seller creates a payout request
exports.createPayoutRequest = async (req, res) => {
  try {
    const { sellerId, amount } = req.body;

    // Validate wallet balance
    const wallet = await OwnerWallet.findOne({ where: { sellerId } });
    if (!wallet || wallet.availableBalance < amount) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient wallet balance" });
    }

    const newRequest = await payoutRequest.create({
      sellerId,
      amount,
    });

    return res.status(201).json({
      status: true,
      message: "Payout request created",
      data: newRequest,
    });
  } catch (error) {
    console.error("Create payout request error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create payout request",
      error: error.message,
    });
  }
};

// Admin approves the payout

exports.approvePayoutRequest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { requestId } = req.params;

    // Find payout request
    // Find payout request
    const request = await payoutRequest.findByPk(requestId, { transaction: t });

    if (!request) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Payout request not found",
      });
    }

    if (request.status !== "pending") {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Payout request already processed",
      });
    }

    // Find seller wallet
    const wallet = await OwnerWallet.findOne({
      where: { sellerId: request.sellerId },
      transaction: t,
      lock: t.LOCK.UPDATE, // lock row to prevent race condition
    });

    if (!wallet) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Wallet not found for seller",
      });
    }

    if (parseFloat(wallet.balance) < parseFloat(request.amount)) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Insufficient wallet balance",
      });
    }

    // Update wallet
    await wallet.update(
      {
        balance: parseFloat(wallet.balance) - parseFloat(request.amount),
        withdrawnAmount:
          parseFloat(wallet.withdrawnAmount) + parseFloat(request.amount),
      },
      { transaction: t }
    );

    // Update request
    await request.update(
      {
        status: "approved",
        processed_at: new Date(),
      },
      { transaction: t }
    );

    // Log transaction
    await WalletTransaction.create(
      {
        sellerId: request.sellerId,
        type: "debit",
        amount: request.amount,
        status: "completed",
        reason: "Seller withdrawal approved",
      },
      { transaction: t }
    );

    await t.commit();

    return res.json({
      status: true,
      message: "Payout approved successfully",
      data: request,
    });
  } catch (error) {
    await t.rollback();
    console.error("Approve payout error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to approve payout",
      error: error.message,
    });
  }
};

// Admin rejects the payout
exports.rejectPayoutRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await payoutRequest.findByPk(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({
        status: false,
        message: "Payout request not found or already processed",
      });
    }

    await request.update({
      status: "rejected",
      processed_at: new Date(),
    });

    return res.json({
      status: true,
      message: "Payout request rejected",
      data: request,
    });
  } catch (error) {
    console.error("Reject payout error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to reject payout",
      error: error.message,
    });
  }
};

// Get all payout requests (Admin view)
exports.getAllPayoutRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sellerId = req.query.sellerId;

    // Where condition
    const whereCondition = {};
    if (sellerId) {
      whereCondition.sellerId = sellerId;
    }

    const { count, rows } = await payoutRequest.findAndCountAll({
      where: whereCondition,
      order: [["requested_at", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      status: true,
      data: rows,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch payout requests",
      error: error.message,
    });
  }
};

// Get one payout request by ID
exports.getPayoutRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await payoutRequest.findByPk(id);
    if (!data)
      return res.status(404).json({ status: false, message: "Not found" });
    return res.json({ status: true, data });
  } catch (error) {
    console.error("Fetch by ID error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch payout request",
      error: error.message,
    });
  }
};

exports.deletePayoutRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await payoutRequest.findByPk(id);

    if (!request) {
      return res
        .status(404)
        .json({ status: false, message: "Payout request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        status: false,
        message: "Only pending requests can be deleted",
      });
    }

    await request.destroy();

    return res.json({
      status: true,
      message: "Payout request deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to delete payout request",
      error: error.message,
    });
  }
};
