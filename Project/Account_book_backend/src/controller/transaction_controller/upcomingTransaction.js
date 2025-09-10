const { Op } = require("sequelize");
const moment = require("moment-timezone");
const db = require("../../../config/config");
const { hashValue } = require("../../utils/cryptoHelper");

const Transaction = db.transaction;
const EmiTransaction = db.emi_transaction;
const Collection = db.collection;

const get_all_upcoming_collections_and_transactions = async (req, res) => {
  try {
    const today = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const { search, bookId } = req.query;

    const finalCollections = [];

    // ✅ Step 1: Get all upcoming EMIs
    const emiWhere = {
      coll_emiDue_date: { [Op.gt]: today },
    };

    if (bookId) {
      emiWhere.bookId = bookId;
    }

    const upcomingEmis = await EmiTransaction.findAll({
      where: emiWhere,
      order: [["coll_emiDue_date", "ASC"]],
    });

    // Group by transactionId (collectionId)
    const collectionMap = {};

    for (const emi of upcomingEmis) {
      const txId = emi.transactionId;

      if (!collectionMap[txId]) {
        const collectionWhere = {
          id: txId,
          transaction_type: "COLLECTION",
          transaction_date: { [Op.gt]: today },
        };

        if (bookId) {
          collectionWhere.bookId = bookId;
        }

        const collection = await Collection.findOne({
          where: collectionWhere,
        });

        if (collection) {
          collectionMap[txId] = {
            ...collection.toJSON(),
            type: "COLLECTION",
            emi_transaction: [],
            emi_counts: { None: 0, Pending: 0, Completed: 0 },
          };
        }
      }

      const current = collectionMap[txId];
      if (current) {
        const status = emi.collection_status || "None";
        current.emi_counts[status] = (current.emi_counts[status] || 0) + 1;
        current.emi_transaction.push(emi.toJSON());
      }
    }

    // ✅ Only keep collections where at least 1 EMI is NOT completed
    Object.values(collectionMap).forEach((col) => {
      const total = col.emi_transaction.length;
      const completed = col.emi_transaction.filter(
        (e) => e.collection_status === "Completed"
      ).length;

      if (completed < total) {
        finalCollections.push(col);
      }
    });

    // ✅ Step 2: Get all upcoming TRANSACTIONS (excluding COLLECTION)
    const transactionWhere = {
      transaction_date: { [Op.gt]: today },
      transaction_type: { [Op.ne]: "COLLECTION" },
    };

    if (search) {
      const categoryHash = hashValue(search.trim());
      transactionWhere[Op.or] = [
        { category_hash: { [Op.eq]: categoryHash } }, // match by hash
        { description: { [Op.like]: `%${search}%` } }, // still plain text search
      ];
    }

    if (bookId) {
      transactionWhere.bookId = bookId;
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
      message: "Upcoming collections and transactions filtered by bookId",
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
  get_all_upcoming_collections_and_transactions,
};
