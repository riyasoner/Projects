const express = require("express")
const router = express.Router()
const userRoutes = require("./user_routes/user.routes")
const sellerRoutes = require("./seller_routes/seller.routes")
const adminRoutes = require("./admin_routes/admin.routes")
const productRoutes = require("./product_routes/product.routes")

router.use("/", userRoutes)
router.use("/",sellerRoutes)
router.use("/",adminRoutes)
router.use("/",productRoutes)
module.exports = router