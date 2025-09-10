const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {get_transaction_type_report,get_report_according_account_name,get_category_distribution,get_summery,get_report_according_category,get_transactions_according_category, get_summery_by_BookId, getSuperAdminCategoryDistribution, getPeriodicReportByBookidAndAccountname } = require("../../controller/admin_controller/report_controller")

router.get("/get_transactions_type_report",get_transaction_type_report)
router.get("/get_report_according_to_account_name",get_report_according_account_name)
router.get("/get_category_distribution",get_category_distribution)
router.get("/get_all_account_summery",get_summery)
router.get("/get_category_wise_report",get_report_according_category)

router.get("/get_transaction_by_category",get_transactions_according_category)


//by BookId only
// router.get("/get_transactions_type_report_by_bookId",get_transaction_type_report)
//router.get("/get_report_according_to_account_name",get_report_according_account_name)
//router.get("/get_category_distribution",get_category_distribution)
router.get("/get_all_account_summery_by_bookId",get_summery_by_BookId)
//router.get("/get_category_wise_report",get_report_according_category)
//router.get("/get_transaction_by_category",get_transactions_according_category)

router.get("/getSuperAdminCategoryDistribution",getSuperAdminCategoryDistribution)
router.get("/getPeriodicReportByBookidAndAccountname",getPeriodicReportByBookidAndAccountname)
module.exports = router