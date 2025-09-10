const express = require("express");

const router = express.Router();
const { authorize } = require("../../middleware/authorization");

const { uploads } = require("../../middleware/multer");

const {
  transaction_view_by_superAdmin,
} = require("../../controller/supper_admin/transaction_view_by_suprAdmin.controller");
const {
  account_settled_api,
  getAllSettlementRequest,
  approve_reject_settlement,
} = require("../../controller/supper_admin/settled_account_controller");
const {
  assign_Book,
  getAssiBookByUserId,
  getAllAssiBook,
  getUsersthroughbookId,
  deleteAllotedBook,
} = require("../../controller/supper_admin/books_supper_admin_controller");
const {
  get_allUserAdmin,
} = require("../../controller/supper_admin/all_user_admin_controller");
const {
  getadminCategories,
} = require("../../controller/category_controller/category.controller");

router.post(
  "/view_transaction_by_sup_admin",
  uploads.none(),
  transaction_view_by_superAdmin
);

router.post(
  "/account_settled_By_sup_admin",
  uploads.none(),
  account_settled_api
);
router.get("/get_all_pending_reques_for_settelment", getAllSettlementRequest);
router.patch(
  "/request_approve_reject_settlement",
  uploads.none(),
  approve_reject_settlement
);

router.post("/assign_book_to_user", uploads.none(), assign_Book);
router.get("/get_assigned_book_by_userId", getAssiBookByUserId);
router.get("/get_all_assigned_books", getAllAssiBook);
router.get("/get_all_user_admin", get_allUserAdmin);

router.get("/get_all_alloted_user_by_book", getUsersthroughbookId);

router.delete("/remove_assigned_book", deleteAllotedBook);

router.get("/getadminCategories", getadminCategories);

module.exports = router;
