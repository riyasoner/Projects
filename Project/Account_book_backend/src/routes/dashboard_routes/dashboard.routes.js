const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {dashboard_inc_exp ,currentMonth_inc_exp} = require("../../controller/dashboard_controller/dashboard.controller")

router.get("/dashboard_income_expe",dashboard_inc_exp)
router.get("/get_current_month_inc_exp",currentMonth_inc_exp)

module.exports = router