const db = require("../../../config/config");

const CoinRules = db.coinRules;
const Coins = db.coin;
// CREATE Coin Rule
exports.createCoinRule = async (req, res) => {
  try {
    const { actionType, coinsPerAction, perAmount, isActive, createdBy } =
      req.body;

    if (!actionType || !coinsPerAction) {
      return res.status(400).json({
        status: false,
        message: "actionType and coinsPerAction are required",
      });
    }

    const rule = await CoinRules.create({
      actionType,
      coinsPerAction,
      perAmount,
      isActive: isActive ?? true,
      createdBy,
    });

    return res.status(201).json({
      status: true,
      message: "Coin rule created successfully",
      data: rule,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// GET All Coin Rules
exports.getAllCoinRules = async (req, res) => {
  try {
    let { page = 1, limit = 10, createdBy } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Build filter conditions
    const whereClause = {};
    if (createdBy) {
      whereClause.createdBy = createdBy;
    }

    // Fetch paginated and filtered data
    const { count, rows } = await CoinRules.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// GET Coin Rule by ID
exports.getCoinRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await CoinRules.findByPk(id);

    if (!rule) {
      return res
        .status(404)
        .json({ status: false, message: "Coin rule not found" });
    }

    return res.status(200).json({ status: true, data: rule });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// UPDATE Coin Rule
exports.updateCoinRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType, coinsPerAction, perAmount, isActive } = req.body;

    const rule = await CoinRules.findByPk(id);
    if (!rule) {
      return res
        .status(404)
        .json({ status: false, message: "Coin rule not found" });
    }

    await rule.update({ actionType, coinsPerAction, perAmount, isActive });
    return res.status(200).json({
      status: true,
      message: "Coin rule updated successfully",
      data: rule,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE Coin Rule
exports.deleteCoinRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await CoinRules.findByPk(id);

    if (!rule) {
      return res
        .status(404)
        .json({ status: false, message: "Coin rule not found" });
    }

    await rule.destroy();
    return res
      .status(200)
      .json({ status: true, message: "Coin rule deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.applyCoinRule = async ({
  userId,
  actionType,
  amount,
  referenceId,
  transaction,
}) => {
  // 1. Find rule for the action type
  const rule = await db.coinRules.findOne({
    where: { actionType, isActive: true },
    transaction,
  });
  if (!rule) return;

  // 2. Calculate coins
  let coinsToCredit = 0;
  if (rule.perAmount && amount) {
    coinsToCredit = Math.floor((amount / rule.perAmount) * rule.coinsPerAction);
  } else {
    coinsToCredit = rule.coinsPerAction;
  }

  if (coinsToCredit <= 0) return;

  // 3. Update user's total coin balance
  let userCoins = await db.coin.findOne({ where: { userId }, transaction });
  if (!userCoins) {
    userCoins = await db.coin.create({ userId, balance: 0 }, { transaction });
  }
  userCoins.balance += coinsToCredit;
  await userCoins.save({ transaction });

  // 4. Log transaction
  await db.coinTransaction.create(
    {
      userId,
      actionType,
      coins: coinsToCredit,
      transactionType: "CREDIT",
      description: `Coins for ${actionType}`,
      referenceId,
    },
    { transaction }
  );

  return coinsToCredit;
};

// Get coin balance by user ID
exports.getCoinBalanceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const coinRecord = await Coins.findOne({
      where: { userId },
      attributes: ["userId", "balance"],
    });

    if (!coinRecord) {
      return res.status(404).json({
        status: false,
        message: "No coin balance found for this user",
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        userId: coinRecord.userId,
        balance: coinRecord.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
