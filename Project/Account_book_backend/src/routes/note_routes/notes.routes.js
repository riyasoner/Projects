const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {createNote,getAllNotes,getNoteById,updateNote,deleteNote,getAllWaitedTask } = require("../../controller/note_controller/note.controller")

router.post('/create_note',uploads.none(),createNote)
router.get("/get_all_notes",getAllNotes)
router.get("/get_note_by_id/:id",getNoteById)
router.patch("/update_note_by_id/:id",uploads.none(),updateNote)
router.delete("/delete_note_by_id/:id",uploads.none(),deleteNote)
router.get('/get_all_waiting_task',getAllWaitedTask)

module.exports = router