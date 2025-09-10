const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {create_Book,getAllBooks,getBookById,updateBook,deletBook ,get_book_report,getBookById_user_side,get_account_report} = require("../../controller/book_controller/book.controller")

router.post('/create_book',uploads.none(),create_Book)
router.get("/get_all_books",getAllBooks)
router.get("/get_book_by_id/:id",getBookById)
router.patch("/update_book_by_id/:id",uploads.none(),updateBook)
router.delete("/delete_book_by_id/:id",uploads.none(),deletBook)
router.get("/get_book_report_summery/:id",get_book_report)
router.get("/get_book_by_id_user_side",getBookById_user_side)
router.get("/get_account_report_user_side",get_account_report)
module.exports = router