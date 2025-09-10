const express = require("express");

const router = express.Router();
const { authorize } = require("../../middleware/authorization");

const { uploads } = require("../../middleware/multer");

const {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  get_deleted_and_archive_account,
  archiveAccount,
  getAccountById_for_balance,
  restore_account,
  deleteAccountPermanently,
  getAccountSuggestions,
} = require("../../controller/account_controller/account.controller");

router.post("/create_account", uploads.none(), createAccount);
router.get("/get_all_accounts", getAllAccounts);
router.get("/get_account_by_id/:id", getAccountById);
router.get("/get_account_by_id_for_balance/:id", getAccountById_for_balance);
router.patch("/update_account_by_id/:id", uploads.none(), updateAccount);
router.delete("/delete_account_by_id/:id", uploads.none(), deleteAccount);
router.get(
  "/get_deleted_and_archive_accounts",
  get_deleted_and_archive_account
);
router.post("/add_account_in_archive/:id", uploads.none(), archiveAccount);
router.patch("/restore_account", restore_account);
router.delete("/deleteAccountPermanently/:id", deleteAccountPermanently);
router.get("/getAccountSuggestions", getAccountSuggestions);

module.exports = router;
