const express = require("express");

const router = express.Router();

const { uploads } = require("../../middlewares/multer");
const {
  userRegistration,
} = require("../../controllers/user_controller/registration.controller");
const { login } = require("../../controllers/user_controller/login.controller");
const {
  forgetPassword,
  resetPassword,
} = require("../../controllers/user_controller/forgot_password.controller");
const {
  changePassword,
} = require("../../controllers/user_controller/change_password");
const {
  updateProfile,
} = require("../../controllers/user_controller/update_profile");
const {
  getUserById,
} = require("../../controllers/user_controller/getUserById");
const {
  getAllUsers,
} = require("../../controllers/user_controller/getAllUser.controller");
const {
  getUserSummary,
} = require("../../controllers/user_controller/userSummary");
const {
  verifyUser,
} = require("../../controllers/user_controller/verify.controller");
const {
  submitContactForm,
  getAllContacts,
} = require("../../controllers/user_controller/contactUs.controller");
const {
  createFAQ,
  getFAQs,
  updateFAQ,
  deleteFAQ,
  getFAQById,
} = require("../../controllers/user_controller/faq.controller");
const {
  deleteUserById,
} = require("../../controllers/user_controller/deleteUserById");
const {
  createRating,
  approveRating,
  getApprovedRatings,
  deleteRating,
  updateRating,
  getRatingById,
  getAllRatings,
} = require("../../controllers/user_controller/customerRating.controller");
const {
  getUserWallet,
  createAddMoneyOrder,
  verifyAddMoneyPayment,
} = require("../../controllers/user_controller/userWalletController");
const {
  getCashbackByUserId,
  getCashbackHistory,
} = require("../../controllers/user_controller/getCashbackController");
const {
  fcmRegistration,
} = require("../../controllers/user_controller/fcmRegister");

router.post("/registration", uploads.single("profileImage"), userRegistration);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/changePassword", changePassword);
router.patch("/updateProfile", uploads.single("profileImage"), updateProfile);

router.get("/getUserById/:id", getUserById);
router.get("/getAllUsers", getAllUsers);

router.get("/getUserSummary", getUserSummary);
router.patch("/verifyUser/:userId", verifyUser);

router.post("/submitContactForm", submitContactForm);
router.get("/getAllContacts", getAllContacts);

router.post("/createFAQ", createFAQ);
router.get("/getFAQs", getFAQs);
router.patch("/updateFAQ/:id", updateFAQ);
router.delete("/deleteFAQ/:id", deleteFAQ);
router.get("/getFAQById/:id", getFAQById);

router.delete("/deleteUserById/:id", deleteUserById);

router.post("/createRating", createRating);
router.patch("/approveRating/:ratingId", approveRating);
router.get("/getApprovedRatings", getApprovedRatings);
router.delete("/deleteRating/:id", deleteRating);
router.patch("/updateRating/:id", updateRating);
router.get("/getRatingById/:id", getRatingById);
router.get("/getAllRatings", getAllRatings);

router.get("/getUserWallet/:id", getUserWallet);
router.post("/addWalletBalance", createAddMoneyOrder);
router.post("/verifyWalletPayment", verifyAddMoneyPayment);

router.get("/getCashbackHistory/:userId", getCashbackHistory);

router.post("/fcmRegistration", fcmRegistration);
module.exports = router;
