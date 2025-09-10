const db = require("../../../config/config");

const CashbackRule = db.cashbackRule;
// Create cashback rule
exports.createCashbackRule = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.cashbackType || !data.cashbackValue) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields." });
    }
    if (!["percentage", "fixed"].includes(data.cashbackType)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid cashbackType." });
    }

    const cashbackRule = await CashbackRule.create(data);
    return res
      .status(201)
      .json({ status: true, message: "Cashback rule created", cashbackRule });
  } catch (error) {
    console.error("Create cashback error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all cashback rules
exports.getCashbackRules = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;

    const where = {};
    if (typeof isActive !== "undefined") {
      where.isActive = isActive === "true";
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await CashbackRule.findAndCountAll({
      where,
      offset: Number(offset),
      limit: Number(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      status: true,
      total: count,
      page: Number(page),
      limit: Number(limit),
      cashbackRules: rows,
    });
  } catch (error) {
    console.error("Get cashback rules error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get cashback rule by ID
exports.getCashbackRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const cashbackRule = await CashbackRule.findByPk(id);
    if (!cashbackRule) {
      return res
        .status(404)
        .json({ status: false, message: "Cashback rule not found" });
    }
    return res.json({ status: true, cashbackRule });
  } catch (error) {
    console.error("Get cashback by ID error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update cashback rule
exports.updateCashbackRule = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const cashbackRule = await CashbackRule.findByPk(id);
    if (!cashbackRule) {
      return res
        .status(404)
        .json({ status: false, message: "Cashback rule not found" });
    }

    if (
      data.cashbackType &&
      !["percentage", "fixed"].includes(data.cashbackType)
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid cashbackType." });
    }

    await cashbackRule.update(data);
    return res.json({
      status: true,
      message: "Cashback rule updated",
      cashbackRule,
    });
  } catch (error) {
    console.error("Update cashback error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete cashback rule (soft delete)
exports.deleteCashbackRule = async (req, res) => {
  try {
    const { id } = req.params;
    const cashbackRule = await CashbackRule.findByPk(id);
    if (!cashbackRule) {
      return res
        .status(404)
        .json({ status: false, message: "Cashback rule not found" });
    }
    await cashbackRule.update({ isActive: false });
    return res.json({ status: true, message: "Cashback rule deactivated" });
  } catch (error) {
    console.error("Delete cashback error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
