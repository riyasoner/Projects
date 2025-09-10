const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {get_all_notification } = require("../../controller/notification_controller/notification.controller")

router.get("/get_all_notification",get_all_notification)



module.exports = router