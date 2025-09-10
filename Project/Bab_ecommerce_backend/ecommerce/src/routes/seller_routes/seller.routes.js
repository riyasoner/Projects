const express = require("express");

const router = express.Router();

const { uploads } = require("../../middlewares/multer");
const {
  createSellerProfile,
  getAllSellers,
  approveSeller,
  getSellerById,
  deleteSellerById,
} = require("../../controllers/seller_controller/seller.controller");
const {
  getSellerSummary,
} = require("../../controllers/seller_controller/sellerSummary.controller");
const {
  getSellerDashboard,
} = require("../../controllers/seller_controller/sellerDashboard.controller");
const {
  getRecentOrders,
} = require("../../controllers/seller_controller/recentOrder.controller");
const {
  getInventorySummary,
} = require("../../controllers/seller_controller/inventorySummary.controller");
const {
  getTopProductsBySeller,
} = require("../../controllers/seller_controller/topProduct.controller");
const {
  getSalesOverviewBySeller,
} = require("../../controllers/seller_controller/salesOverview.controller");

const payoutcontroller = require("../../controllers/seller_controller/payout.controller");
const {
  getOrdersBySellerId,
} = require("../../controllers/seller_controller/getOrderBySellerId");
const {
  getWalletSummary,
} = require("../../controllers/seller_controller/getWalletDetails");
const {
  getSellerMonthlyRevenue,
} = require("../../controllers/seller_controller/revenue.controller");
const {
  tracking,
} = require("../../controllers/product_controller/tracking.controller");
const blogController = require("../../controllers/seller_controller/blogController");
const {
  getSellerApplicationStatus,
} = require("../../controllers/seller_controller/getSellerApplicationStatus");

router.post(
  "/createSellerProfile",
  uploads.array("businessDocs", 5),
  createSellerProfile
);
router.get("/getSellerSummary", getSellerSummary);
router.get("/getSellerDashboard", getSellerDashboard);
router.get("/getRecentOrders", getRecentOrders);
router.get("/getInventorySummary", getInventorySummary);
router.get("/getTopProductsBySeller", getTopProductsBySeller);
router.get("/getSalesOverviewBySeller", getSalesOverviewBySeller);
router.get("/getAllSellers", getAllSellers);
router.patch("/approveSeller/:id", approveSeller);
router.get("/getSellerApplicationStatus/:userId", getSellerApplicationStatus);
router.post("/createPayoutRequest", payoutcontroller.createPayoutRequest);
router.get("/getAllPayoutRequests", payoutcontroller.getAllPayoutRequests);
router.get("/getPayoutRequestById/:id", payoutcontroller.getPayoutRequestById);
router.patch(
  "/approvePayoutRequest/:requestId",
  payoutcontroller.approvePayoutRequest
);
router.patch(
  "/rejectPayoutRequest/:requestId",
  payoutcontroller.rejectPayoutRequest
);
router.delete(
  "/deletePayoutRequestById/:id",
  payoutcontroller.deletePayoutRequestById
);

router.get("/getOrdersBySellerId/:sellerId", getOrdersBySellerId);

router.get("/getWalletSummary/:sellerId", getWalletSummary);

router.get("/getSellerById/:sellerId", getSellerById);
router.get("/getSellerMonthlyRevenue", getSellerMonthlyRevenue);
router.patch("/tracking", tracking);

router.delete("/deleteSellerById/:id", deleteSellerById);

router.post(
  "/createBlog",
  uploads.array("blogImages", 10),
  blogController.createBlog
);
router.get("/getBlogs", blogController.getBlogs);
router.get("/getBlogById/:id", blogController.getBlogById);
router.patch(
  "/updateBlog/:id",
  uploads.array("blogImages", 10),
  blogController.updateBlog
);
router.delete("/deleteBlog/:id", blogController.deleteBlog);

module.exports = router;
