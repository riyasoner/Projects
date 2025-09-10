const express = require("express");

const router = express.Router();
const { uploads } = require("../../middlewares/multer");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategoryId,
  getAllCategoriess,
} = require("../../controllers/admin_controller/category.controller");
const {
  getAdminDashboardStats,
} = require("../../controllers/admin_controller/adminDashboard.controller");
const {
  getTopSellers,
} = require("../../controllers/admin_controller/topSeller.controller");
const {
  getLatestActivity,
} = require("../../controllers/admin_controller/latestActivity.controller");
const {
  createShippingFee,
  getAllShippingFees,
  updateShippingFee,
  deleteShippingFee,
  getShippingFeeById,
} = require("../../controllers/admin_controller/shippingFee.controller");
const controller = require("../../controllers/admin_controller/adminFee.controller");
const {
  getMonthlyRevenue,
} = require("../../controllers/admin_controller/revenue.controller");
const {
  createMainCategory,
  createSubCategory,
  getAllMainCategories,
  getAllSubCategories,
  deleteMainCategory,
  deleteSubCategory,
  updateMainCategory,
  updateSubCategory,
  getTop5MainCategories,
} = require("../../controllers/admin_controller/AllCategoryController");
const cashbackController = require("../../controllers/admin_controller/cashbackControler");
const coinRulesController = require("../../controllers/admin_controller/userCoinRuleController");
const {
  createBanner,
  getAllBanners,
  deleteBanner,
  updateBanner,
} = require("../../controllers/admin_controller/bannerController");
const {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../../controllers/admin_controller/announcement.controller");
const {
  createRefundSetting,
  getAllRefundSettings,
  updateRefundSetting,
  deleteRefundSetting,
} = require("../../controllers/admin_controller/refundController");
router.post("/createCategory", uploads.single("image"), createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);
router.patch("/updateCategory/:id", uploads.single("image"), updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);
router.get(
  "/getSubcategoriesByCategoryId/:categoryId",
  getSubcategoriesByCategoryId
);

router.get("/getAdminDashboardStats", getAdminDashboardStats);
router.get("/getTopSellers", getTopSellers);
router.get("/getLatestActivity", getLatestActivity);

router.post("/createShippingFee", createShippingFee);
router.get("/getAllShippingFees", getAllShippingFees);
router.patch("/updateShippingFee/:id", updateShippingFee);
router.delete("/deleteShippingFee/:id", deleteShippingFee);
router.get("/getShippingFeeById/:id", getShippingFeeById);

router.post("/createAdminFeeConfig", controller.createAdminFeeConfig);
router.get("/getAllAdminFeeConfigs", controller.getAllAdminFeeConfigs);
router.get("/getAdminFeeConfigById/:id", controller.getAdminFeeConfigById);
router.patch("/updateAdminFeeConfig/:id", controller.updateAdminFeeConfig);
router.delete("/deleteAdminFeeConfig/:id", controller.deleteAdminFeeConfig);

router.get("/getMonthlyRevenue", getMonthlyRevenue);

router.post("/createMainCategory", uploads.single("image"), createMainCategory);
router.delete("/deleteMainCategory/:id", deleteMainCategory);
router.get("/getAllMainCategories", getAllMainCategories);
router.patch(
  "/updateMainCategory/:id",
  uploads.single("image"),
  updateMainCategory
);

router.post("/createSubCategory", uploads.single("image"), createSubCategory);
router.get("/getAllSubCategories", getAllSubCategories);
router.delete("/deleteSubCategory/:id", deleteSubCategory);
router.patch(
  "/updateSubCategory/:id",
  uploads.single("image"),
  updateSubCategory
);

router.get("/getAllCategoriess", getAllCategoriess);
router.get("/getTop5MainCategories", getTop5MainCategories);

router.post("/createCashbackRule", cashbackController.createCashbackRule);
router.get("/getCashbackRules", cashbackController.getCashbackRules);
router.get("/getCashbackRuleById/:id", cashbackController.getCashbackRuleById);
router.patch("/updateCashbackRule/:id", cashbackController.updateCashbackRule);
router.delete("/deleteCashbackRule/:id", cashbackController.deleteCashbackRule);

router.post("/createCoinRule", coinRulesController.createCoinRule);
router.get("/getAllCoinRules", coinRulesController.getAllCoinRules);
router.get("/getCoinRuleById/:id", coinRulesController.getCoinRuleById);
router.patch("/updateCoinRule/:id", coinRulesController.updateCoinRule);
router.delete("/deleteCoinRule/:id", coinRulesController.deleteCoinRule);
router.get(
  "/getCoinBalanceByUserId/:userId",
  coinRulesController.getCoinBalanceByUserId
);

router.post("/createBanner", uploads.single("bannerImage"), createBanner);
router.get("/getAllBanners", getAllBanners);
router.delete("/deleteBanner/:id", deleteBanner);
router.patch("/updateBanner/:id", uploads.single("bannerImage"), updateBanner);

router.post("/createAnnouncement", createAnnouncement);
router.get("/getAllAnnouncements", getAllAnnouncements);
router.patch("/updateAnnouncement/:id", updateAnnouncement);
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);

router.post("/createRefundSetting", createRefundSetting);
router.get("/getAllRefundSettings", getAllRefundSettings);
router.patch("/updateRefundSetting/:id", updateRefundSetting);
router.delete("/deleteRefundSetting/:id", deleteRefundSetting);

module.exports = router;
