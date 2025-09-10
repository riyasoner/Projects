const express = require("express");

const router = express.Router();

const { uploads } = require("../../middlewares/multer");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductByShareableLink,
  getVariantById,
  deleteVariant,
  updateVariant,
  getNewArrivalProducts,
  getOnSaleProducts,
  getRelatedProducts,
  getProductsByIds,
} = require("../../controllers/product_controller/product.controller");
const {
  addToWishlist,
  getWishlistByUser,
  removeFromWishlist,
} = require("../../controllers/product_controller/wishList.controller");
const {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
  cartSync,
  removeOrderedFromCart,
} = require("../../controllers/product_controller/cart.controller");
const {
  addOrUpdateReview,
  getReviewsByProduct,
  deleteReview,
  canUserRate,
} = require("../../controllers/product_controller/review.controller");
const {
  addOrUpdateInventory,
  getInventoryBySeller,
  deleteInventory,
  getInventoryById,
  getAllInventory,
} = require("../../controllers/product_controller/inventory.controller");
const {
  addAddress,
  updateAddress,
  getAddressesByUser,
  deleteAddress,
} = require("../../controllers/product_controller/address.controller");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderSummary,
  cancelOrder,
  markOrderAsDelivered,
  markSuborderAsDelivered,
  addOrderCustomisation,
  getCustomisationsOrderbySellerId,
  cancelUnpaidOrder,
} = require("../../controllers/product_controller/order.controlle");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../../controllers/product_controller/coupon.controller");
const {
  createTicket,
  getAllTickets,
  getTicketsByUser,
  updateTicketStatus,
  addReply,
  getSupportTicketSummary,
} = require("../../controllers/product_controller/supportTicket.controller");

const {
  checkout,
} = require("../../controllers/product_controller/checkout.controller");
const {
  verifyRazorpayPayment,
} = require("../../controllers/product_controller/verifysignature.controller");
const {
  razorpayWebhook,
} = require("../../controllers/product_controller/webhook.controller");
const {
  globalSearch,
} = require("../../controllers/product_controller/globalSearch");
router.post("/createProduct", uploads.any(), createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);
router.patch("/updateProductById/:id", uploads.any(), updateProductById);
router.delete("/deleteProductById/:id", deleteProductById);
router.get("/product/:shareableLink", getProductByShareableLink);
router.get("/getVariantById/:id", getVariantById);
router.delete("/deleteVariant/:id", deleteVariant);
router.patch("/updateVariant/:id", uploads.any(), updateVariant);
router.get("/getNewArrivalProducts", getNewArrivalProducts);
router.get("/getOnSaleProducts", getOnSaleProducts);
router.get("/getRelatedProducts/:productId", getRelatedProducts);
router.post("/addToWishlist", addToWishlist);
router.get("/getWishlistByUser/:userId", getWishlistByUser);
router.post("/removeFromWishlist", removeFromWishlist);

router.post("/addToCart", addToCart);
router.get("/getCartByUser/:userId", getCartByUser);
router.patch("/updateCartItem", updateCartItem);
router.delete("/removeCartItem/:cartId", removeCartItem);
router.post("/cartSync", cartSync);
router.post("/removeOrderedFromCart", removeOrderedFromCart);
router.post("/checkout", checkout);

router.post(
  "/addOrUpdateReview",
  uploads.single("reviewImage"),
  addOrUpdateReview
);
router.get("/getReviewsByProduct/:productId", getReviewsByProduct);
router.delete("/deleteReview/:id", deleteReview);
router.post("/canUserRate", canUserRate);

router.post("/addOrUpdateInventory", addOrUpdateInventory);
router.get("/getInventoryBySeller", getInventoryBySeller);
router.delete("/deleteInventory/:id", deleteInventory);
router.get("/getAllInventory", getAllInventory);
router.get("/getInventoryById/:id", getInventoryById);

router.post("/addAddress", addAddress);
router.patch("/updateAddress/:id", updateAddress);
router.get("/getAddressesByUser/:userId", getAddressesByUser);
router.delete("/deleteAddress/:id", deleteAddress);

router.post("/createOrder", createOrder);
router.get("/getOrders", getOrders);
router.get("/getOrderById/:orderId", getOrderById);
router.patch("/updateOrderStatus/:orderId", updateOrderStatus);
router.delete("/deleteOrder/:orderId", deleteOrder);
router.get("/getOrderSummary", getOrderSummary);
router.post("/verifyRazorpayPayment", verifyRazorpayPayment);
router.post(
  "/razorpayWebhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);
router.patch("/cancelOrder/:orderId", cancelOrder);
router.patch("/markOrderAsDelivered/:orderId", markOrderAsDelivered);
router.patch("/markSuborderAsDelivered", markSuborderAsDelivered);
router.post("/addOrderCustomisation", addOrderCustomisation);
router.get(
  "/getCustomisationsOrderbySellerId/:sellerId",
  getCustomisationsOrderbySellerId
);
router.post("/cancelUnpaidOrder", cancelUnpaidOrder);

router.post("/createCoupon", createCoupon);
router.get("/getAllCoupons", getAllCoupons);
router.get("/getCouponById/:id", getCouponById);
router.patch("/updateCoupon/:id", updateCoupon);
router.delete("/deleteCoupon/:id", deleteCoupon);
router.post("/applyCoupon", applyCoupon);

router.post("/createTicket", createTicket);
router.get("/getAllTickets", getAllTickets);
router.get("/getTicketsByUser/:userId", getTicketsByUser);
router.patch("/updateTicketStatus/:ticketId", updateTicketStatus);
router.post("/addReply", addReply);
router.get("/getSupportTicketSummary", getSupportTicketSummary);

router.get("/globalSearch", globalSearch);

router.post("/getProductsByIds", getProductsByIds);
module.exports = router;
