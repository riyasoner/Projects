const express = require("express");

const router = express.Router();
const { authorize } = require("../../middleware/authorization");

const { uploads } = require("../../middleware/multer");

const {
  registration,
  otpVerify,
  store_otp,
} = require("../../controller/user_controller/registration.controller");
const {
  login,
  delete_user_by_phone,
} = require("../../controller/user_controller/login.controller");
const { refresh_token } = require("../../services/refreshToken");
// const {changePassword } = require("../../controller/user_controller/")
// const {logoutUpdate } = require("../../controller/user_controller/logout.controller")

const {
  changePassword,
} = require("../../controller/user_controller/change_password.controller");
const {
  edit_user,
  view_user,
  update_user_details,
} = require("../../controller/user_controller/edit_user.controller");
const {
  userLogOut,
} = require("../../controller/user_controller/logout.controller");
const { updateUser } = require("../../controller/user_controller/updateUser");
const {
  refreshToken,
} = require("../../controller/user_controller/refreshToken_controller");
const { authLimiter } = require("../../middleware/ratelimit");

router.post("/registration", authLimiter, uploads.none(), registration);
router.post("/otp_verify", authLimiter, uploads.none(), otpVerify);
router.post("/store_otp", authLimiter, uploads.none(), store_otp);

router.post("/refresh_token", uploads.none(), refresh_token);
router.post("/login", authLimiter, uploads.none(), login);
// router.post("/logout",uploads.none(),logoutUpdate)

router.post("/change_password", authLimiter, uploads.none(), changePassword);
router.patch(
  "/update_user_info_and_pass",
  authLimiter,
  uploads.none(),
  edit_user
);
router.get("/get_user_info", view_user);
router.post("/logout/:userId", uploads.none(), userLogOut);
router.post("/update_user_details", uploads.none(), update_user_details);
router.post(
  "/delete_user_by_phone_no",
  authLimiter,
  uploads.none(),
  delete_user_by_phone
);

router.patch("/updateUser", authLimiter, updateUser);

router.post("/refreshToken", refreshToken);

module.exports = router;
