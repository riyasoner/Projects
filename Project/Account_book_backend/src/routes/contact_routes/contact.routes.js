const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {createContact,getAllContacts,getContactById,updateContact,deleteContact } = require("../../controller/contact_controller/contact.controller")

router.post('/create_contact',uploads.single('contact_image'),createContact)
router.get("/get_all_contacts",getAllContacts)
router.get("/get_contact_by_id/:id",getContactById)
router.patch("/update_contact_by_id/:id",uploads.none(),updateContact)
router.delete("/delete_contact_by_id/:id",uploads.none(),deleteContact)

module.exports = router