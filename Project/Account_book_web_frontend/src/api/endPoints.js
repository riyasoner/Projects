const endPoints = {
  registration: "/account_book/registration",
  login: "/account_book/login",
  refreshToken: "/account_book/refreshToken",

  addBook: "/account_book/create_book",
  getAllBooks: "/account_book/get_all_books",
  deleteBook: "/account_book/delete_book_by_id",
  updateBook: "/account_book/update_book_by_id",
  getBookById: "/account_book/get_book_by_id",
  getAssignedBook: "/account_book/get_assigned_book_by_userId",
  removeAssignedBook: "/account_book/remove_assigned_book",
  addAccount: "/account_book/create_account",
  getAllAccounts: "/account_book/get_all_accounts",
  getAllAssignBook: "/account_book/get_all_assigned_books",

  getAllUser: "/account_book/get_all_user_admin",
  updateUserDetails: "/account_book/update_user_details",
  deleteUser: "/account_book/delete_user_by_phone_no",

  getArchiveAccount: "/account_book/get_deleted_and_archive_accounts",
  deleteAccount: "/account_book/delete_account_by_id",
  archiveAccount: "/account_book/add_account_in_archive",
  restoreAccount: "/account_book/restore_account",
  updateAccountById: "/account_book/update_account_by_id",
  deleteAccountPermanently: "/account_book/deleteAccountPermanently",
  accountSuggestions: "/account_book/getAccountSuggestions",

  getAllTransactions: "/account_book/get_all_transactions",
  addTransaction: "/account_book/create_new_transaction",
  upcommingTransaction: "/account_book/get_all_upcomming_transaction",
  viewTransactionBySupAdmin: "/account_book/view_transaction_by_sup_admin",
  deleteTransactionById: "/account_book/delete_transaction_by_id",
  updateTransaction: "/account_book/update_transaction_by_id",

  addCategory: "/account_book/create_category",
  getCategories: "/account_book/get_all_categorys",
  deleteCategory: "/account_book/delete_category_by_id",
  updateCategory: "/account_book/update_category_by_id",

  getTransactionsTypeReport: "/account_book/get_transactions_type_report",
  getCategoryDistribution: "/account_book/get_category_distribution",
  getCategoryWiseReport: "/account_book/get_category_wise_report",
  getReportAccAccountName: "/account_book/get_report_according_to_account_name",

  getNotes: "/account_book/get_all_notes",
  updateNote: "/account_book/update_note_by_id",
  addNote: "/account_book/create_note",
  getWaitingTask: "/account_book/get_all_waiting_task",

  getUserInfo: "/account_book/get_user_info",
  updateUserInfoAndPass: "/account_book/update_user_info_and_pass",
  getAllUser: "/account_book/get_all_user_admin",
  getFeedbacks: "/account_book/get_all_feedbacks",
  addFeedback: "/account_book/create_feedback",

  getNotification: "/account_book/get_all_notification",

  getSummary: "/account_book/get_all_account_summery",

  accountSettled: "/account_book/account_settled_By_sup_admin",

  assignBook: "/account_book/assign_book_to_user",

  getPendingRequesForSettelment:
    "/account_book/get_all_pending_reques_for_settelment",
  requestSettlement: "/account_book/request_approve_reject_settlement",

  updateCollectionStatus: "/account_book/markEmiAsPaidOrComplete",

  getAccountBalance: "/account_book/get_account_by_id_for_balance",
  getAllAccountSummeryByBookId:
    "/account_book/get_all_account_summery_by_bookId",
  get_all_transactions_for_download:
    "/account_book/get_all_transactions_for_download",

  getSuperAdminCategoryDistribution:
    "/account_book/getSuperAdminCategoryDistribution",
  getPeriodicReportByBookidAndAccountname:
    "/account_book/getPeriodicReportByBookidAndAccountname",
  get_all_collection: "/account_book/get_all_collection",
  deleteCollection: "/account_book/delete_collection",
  update_collection: "/account_book/update_collection",
  get_all_upcoming_collections_and_transactions:
    "/account_book/get_all_upcoming_collections_and_transactions",

  updateUser: "/account_book/updateUser",
};
export default endPoints;
