const express = require("express")
const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")


const {assign_account,getAllAssiaccount,getAssiaccountByUserId,getUsersthroughaccountId,getAssigneAccountById,getAllAccountsByUserIdAndBookId } = require("../../controller/admin_controller/account_assigned_admin_controller")

router.post('/assign_account_to_user',uploads.none(),assign_account)
router.get('/get_all_assigned_accounts',getAllAssiaccount)
router.get('/get_assigned_account_by_userId',getAssiaccountByUserId)
router.get('/get_all_alloted_user_by_account',getUsersthroughaccountId)

router.get('/get_all_transaction_by_assigned_acc',getAssigneAccountById)
router.get("/get_account_list_by_userid_bookid",getAllAccountsByUserIdAndBookId)

module.exports = router