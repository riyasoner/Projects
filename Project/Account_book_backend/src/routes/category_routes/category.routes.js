const express = require("express")

const router = express.Router()
const { authorize } = require('../../middleware/authorization')

const {uploads} = require("../../middleware/multer")

const {createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } = require("../../controller/category_controller/category.controller")

router.post('/create_category',uploads.none(),createCategory)
router.get("/get_all_categorys",getAllCategories)
router.get("/get_category_by_id/:id",getCategoryById)
router.patch("/update_category_by_id/:id",uploads.none(),updateCategory)
router.delete("/delete_category_by_id/:id",uploads.none(),deleteCategory)

module.exports = router