const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {createFeedback,getAllFeedbacks,getFeedbackById,updateFeedback,deleteFeedback } = require("../../controller/feedback_controller/feedback.controller")

router.post('/create_feedback',uploads.none(),createFeedback)
router.get("/get_all_feedbacks",getAllFeedbacks)
router.get("/get_feedback_by_id/:id",getFeedbackById)
router.patch("/update_feedback_by_id/:id",uploads.none(),updateFeedback)
router.delete("/delete_feedback_by_id/:id",uploads.none(),deleteFeedback)

module.exports = router