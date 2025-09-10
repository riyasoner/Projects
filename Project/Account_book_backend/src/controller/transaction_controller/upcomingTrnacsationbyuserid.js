const { Op } = require("sequelize");
const moment = require("moment-timezone");
const db = require("../../../config/config");

const Transaction = db.transaction;
const EmiTransaction = db.emi_transaction;
const Collection = db.collection;

const get_all_upcoming_collections_and_transactions_by_userid = async (
  req,
  res
) => {
  try {
    const today = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const { search, userId, bookId } = req.query;

    const finalCollections = [];

    // ✅ Step 1: Get all upcoming COLLECTIONS
    const collectionWhere = {
      transaction_type: "COLLECTION",
      transaction_date: { [Op.gt]: today },
    };
    if (userId) collectionWhere.userId = userId;
    if (bookId) collectionWhere.bookId = bookId;

    const upcomingCollections = await Collection.findAll({
      where: collectionWhere,
      order: [["transaction_date", "ASC"]],
    });

    for (const collection of upcomingCollections) {
      const txId = collection.id;

      // Get all EMI entries for this collection (with due date > today)
      const emiWhere = {
        transactionId: txId,
        coll_emiDue_date: { [Op.gt]: today },
      };
      if (userId) emiWhere.userId = userId;
      if (bookId) emiWhere.bookId = bookId;

      const emiList = await EmiTransaction.findAll({
        where: emiWhere,
        order: [["coll_emiDue_date", "ASC"]],
      });
      // Count status types
      const emi_counts = { None: 0, Pending: 0, Completed: 0 };
      for (const emi of emiList) {
        const status = emi.collection_status || "None";
        emi_counts[status] = (emi_counts[status] || 0) + 1;
      }

      // Only include if not all EMIs are completed
      const total = emiList.length;
      const completed = emi_counts["Completed"];

      if (total > 0 && completed < total) {
        finalCollections.push({
          ...collection.toJSON(),
          type: "COLLECTION",
          emi_transaction: emiList.map((emi) => emi.toJSON()),
          emi_counts,
        });
      }
    }

    // ✅ Step 2: Get all upcoming TRANSACTIONS (excluding COLLECTION)
    const transactionWhere = {
      transaction_date: { [Op.gt]: today },
      transaction_type: { [Op.ne]: "COLLECTION" },
    };

    if (userId) transactionWhere.userId = userId;
    if (bookId) transactionWhere.bookId = bookId;

    if (search) {
      transactionWhere[Op.or] = [
        { category: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const upcomingTransactions = await Transaction.findAll({
      where: transactionWhere,
      order: [["id", "DESC"]],
    });

    const transactionData = upcomingTransactions.map((txn) => ({
      ...txn.toJSON(),
      type: "TRANSACTION",
    }));

    return res.status(200).json({
      status: true,
      message:
        "All upcoming collections and transactions (with optional filters)",
      data: {
        collections: finalCollections,
        transactions: transactionData,
      },
    });
  } catch (error) {
    console.error(
      "Error in get_all_upcoming_collections_and_transactions:",
      error
    );
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  get_all_upcoming_collections_and_transactions_by_userid,
};
