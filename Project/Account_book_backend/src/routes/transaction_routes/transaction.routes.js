const express = require("express");

const router = express.Router();
const { authorize } = require("../../middleware/authorization");

const { uploads } = require("../../middleware/multer");

const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  get_upcoming_transactions,
  processScheduledEmi,
  change_collection_status,
  getAllTransactions_without_pagination,
  markEmiAsPaidOrComplete,
  get_all_collection,
  update_collection,
  delete_collection,
} = require("../../controller/transaction_controller/transaction.controller");
const {
  get_upcoming_collections_with_unpaid_emis,
  get_all_upcoming_collections_and_transactions,
} = require("../../controller/transaction_controller/upcomingTransaction");
const {
  get_all_upcoming_collections_and_transactions_by_userid,
} = require("../../controller/transaction_controller/upcomingTrnacsationbyuserid");

router.post(
  "/create_new_transaction",
  uploads.single("upload_image"),
  createTransaction
);
router.get("/get_all_transactions", getAllTransactions);
router.get(
  "/get_all_transactions_for_download",
  getAllTransactions_without_pagination
);
router.get("/get_transaction_by_id/:id", getTransactionById);
router.patch(
  "/update_transaction_by_id/:id",
  uploads.none(),
  updateTransaction
);
router.delete(
  "/delete_transaction_by_id/:id",
  uploads.none(),
  deleteTransaction
);

router.get("/get_all_upcomming_transaction", get_upcoming_transactions);
router.post("/dedutct_emi", uploads.none(), processScheduledEmi);
router.post("/update_collection_status", change_collection_status);
router.post("/markEmiAsPaidOrComplete", markEmiAsPaidOrComplete);
router.get("/get_all_collection", get_all_collection);

router.get(
  "/get_all_upcoming_collections_and_transactions",
  get_all_upcoming_collections_and_transactions
);
router.get(
  "/get_all_upcoming_collections_and_transactions_by_userid",
  get_all_upcoming_collections_and_transactions_by_userid
);
router.patch("/update_collection/:collectionId", update_collection);
router.delete("/delete_collection/:collectionId", delete_collection);

module.exports = router;
