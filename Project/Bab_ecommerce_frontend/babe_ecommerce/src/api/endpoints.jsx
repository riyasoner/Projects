import React from "react";
const endpoints = {
  registration: "/ecommerce/registration",
  login: "/ecommerce/login",
  forgetPassword: "/ecommerce/forgetPassword",
  resetPassword: "/ecommerce/resetPassword",

  createCategory: "/ecommerce/createCategory",
  getAllCategories: "/ecommerce/getAllCategories",
  deleteCategory: "/ecommerce/deleteCategory",
  updateCategory: "/ecommerce/updateCategory",

  createSellerProfile: "/ecommerce/createSellerProfile",
  addProduct: "/ecommerce/createProduct",
  getAllProducts: "/ecommerce/getAllProducts",
  deleteProductById: "/ecommerce/deleteProductById",
  getProductById: "/ecommerce/getProductById",
  updateVariant: "/ecommerce/updateVariant",
  deleteVariant: "/ecommerce/deleteVariant",
  updateProductById: "/ecommerce/updateProductById",
  getVariantById: "/ecommerce/getVariantById",

  addToCart: "/ecommerce/addToCart",
  getCartByUser: "/ecommerce/getCartByUser",
  updateCartItem: "/ecommerce/updateCartItem",
  removeCartItem: "/ecommerce/removeCartItem",
  addToWishlist: "/ecommerce/addToWishlist",
  getWishlistByUser: "/ecommerce/getWishlistByUser",
  removeFromWishlist: "/ecommerce/removeFromWishlist",
  getAdminDashboardStats: "/ecommerce/getAdminDashboardStats",
  getTopSeller: "/ecommerce/getTopSellers",
  getLatestActivity: "/ecommerce/getLatestActivity",
  createCoupon: "/ecommerce/createCoupon",
  getAllCoupons: "/ecommerce/getAllCoupons",
  getCouponById: "/ecommerce/getCouponById",
  updateCoupon: "/ecommerce/updateCoupon",
  deleteCoupon: "/ecommerce/deleteCoupon",
  createTicket: "/ecommerce/createTicket",
  getAllTickets: "/ecommerce/getAllTickets",
  updateTicketStatus: "/ecommerce/updateTicketStatus",
  getSupportTicketSummary: "/ecommerce/getSupportTicketSummary",
  getAllUsers: "/ecommerce/getAllUsers",
  getUserSummary: "/ecommerce/getUserSummary",

  createShippingFee: "/ecommerce/createShippingFee",
  getAllShippingFees: "/ecommerce/getAllShippingFees",
  updateShippingFee: "/ecommerce/updateShippingFee",
  deleteShippingFee: "/ecommerce/deleteShippingFee",
  getShippingFeeById: "/ecommerce/getShippingFeeById",

  applyCoupon: "/ecommerce/applyCoupon",

  addAddress: "/ecommerce/addAddress",
  updateAddress: "/ecommerce/updateAddress",
  getAddressesByUser: "/ecommerce/getAddressesByUser",
  deleteAddress: "/ecommerce/deleteAddress",

  createOrder: "/ecommerce/createOrder",

  getSellerSummary: "/ecommerce/getSellerSummary",
  getAllSellers: "/ecommerce/getAllSellers",

  verifyRazorpayPayment: "/ecommerce/verifyRazorpayPayment",

  getOrders: "/ecommerce/getOrders",
  updateOrderStatus: "/ecommerce/updateOrderStatus",
  deleteOrder: "/ecommerce/deleteOrder",
  getOrderSummary: "/ecommerce/getOrderSummary",

  createAdminFeeConfig: "/ecommerce/createAdminFeeConfig",
  getAdminFeeConfigById: "/ecommerce/getAdminFeeConfigById",
  getAllAdminFeeConfigs: "/ecommerce/getAllAdminFeeConfigs",
  updateAdminFeeConfig: "/ecommerce/updateAdminFeeConfig",
  deleteAdminFeeConfig: "/ecommerce/deleteAdminFeeConfig",

  createPayoutRequest: "/ecommerce/createPayoutRequest",
  getAllPayoutRequests: "/ecommerce/getAllPayoutRequests",
  getPayoutRequestById: "/ecommerce/getPayoutRequestById",
  rejectPayoutRequest: "/ecommerce/rejectPayoutRequest",
  approvePayoutRequest: "/ecommerce/approvePayoutRequest",
  deletePayoutRequestById: "/ecommerce/deletePayoutRequestById",

  checkout: "/ecommerce/checkout",

  addOrUpdateInventory: "/ecommerce/addOrUpdateInventory",
  getAllInventory: "/ecommerce/getAllInventory",
  getInventoryBySeller: "/ecommerce/getInventoryBySeller",
  deleteInventory: "/ecommerce/deleteInventory",
  getInventoryById: "/ecommerce/getInventoryById",
  getNewArrivalProducts: "/ecommerce/getNewArrivalProducts",
  getOnSaleProducts: "/ecommerce/getOnSaleProducts",

  addOrUpdateReview: "/ecommerce/addOrUpdateReview",
  getReviewsByProduct: "/ecommerce/getReviewsByProduct",
  deleteReview: "/ecommerce/deleteReview",

  getOrderById: "/ecommerce/getOrderById",

  getUserById: "/ecommerce/getUserById",

  approveSeller: "/ecommerce/approveSeller",
  verifyUser: "/ecommerce/verifyUser",

  getOrdersBySellerId: "/ecommerce/getOrdersBySellerId",

  createFAQ: "/ecommerce/createFAQ",
  getFAQs: "/ecommerce/getFAQs",
  updateFAQ: "/ecommerce/updateFAQ",
  deleteFAQ: "/ecommerce/deleteFAQ",
  getFAQById: "/ecommerce/getFAQById",

  submitContactForm: "/ecommerce/submitContactForm",
  getAllContacts: "/ecommerce/getAllContacts",
  changePassword: "/ecommerce/changePassword",
  updateProfile: "/ecommerce/updateProfile",
  getSellerById: "/ecommerce/getSellerById",
  cancelOrder: "/ecommerce/cancelOrder",

  getRelatedProducts: "/ecommerce/getRelatedProducts",
  globalSearch: "/ecommerce/globalSearch",
  getMonthlyRevenue: "/ecommerce/getMonthlyRevenue",
  getSellerDashboard: "/ecommerce/getSellerDashboard",
  getSellerMonthlyRevenue: "/ecommerce/getSellerMonthlyRevenue",
  getWalletSummary: "/ecommerce/getWalletSummary",
  tracking: "/ecommerce/tracking",
  deleteUserById: "/ecommerce/deleteUserById",
  deleteSellerById: "/ecommerce/deleteSellerById",
  addReply: "/ecommerce/addReply",
  getTicketsByUser: "/ecommerce/getTicketsByUser",
  markOrderAsDelivered: "/ecommerce/markOrderAsDelivered",

  product: "/ecommerce/product",
  markSuborderAsDelivered: "/ecommerce/markSuborderAsDelivered",
  cartSync: "/ecommerce/cartSync",

  createRating: "/ecommerce/createRating",
  approveRating: "/ecommerce/approveRating",
  getApprovedRatings: "/ecommerce/getApprovedRatings",
  deleteRating: "/ecommerce/deleteRating",
  updateRating: "/ecommerce/updateRating",
  getRatingById: "/ecommerce/getRatingById",
  getAllRatings: "/ecommerce/getAllRatings",

  createMainCategory: "/ecommerce/createMainCategory",

  createSubCategory: "/ecommerce/createSubCategory",
  getAllMainCategories: "/ecommerce/getAllMainCategories",
  getAllSubCategories: "/ecommerce/getAllSubCategories",
  getAllCategoriess: "/ecommerce/getAllCategoriess",
  deleteMainCategory: "/ecommerce/deleteMainCategory",
  deleteSubCategory: "/ecommerce/deleteSubCategory",
  updateMainCategory: "/ecommerce/updateMainCategory",
  updateSubCategory: "/ecommerce/updateSubCategory",
  getTop5MainCategories: "/ecommerce/getTop5MainCategories",
  getInventorySummary: "/ecommerce/getInventorySummary",
  getRecentOrders: "/ecommerce/getRecentOrders",

  createCashbackRule: "/ecommerce/createCashbackRule",
  getCashbackRules: "/ecommerce/getCashbackRules",
  getCashbackRuleById: "/ecommerce/getCashbackRuleById",
  updateCashbackRule: "/ecommerce/updateCashbackRule",
  deleteCashbackRule: "/ecommerce/deleteCashbackRule",
  getUserWallet: "/ecommerce/getUserWallet",
  addWalletBalance: "/ecommerce/addWalletBalance",
  verifyWalletPayment: "/ecommerce/verifyWalletPayment",
  createCoinRule: "/ecommerce/createCoinRule",
  getAllCoinRules: "/ecommerce/getAllCoinRules",
  updateCoinRule: "/ecommerce/updateCoinRule",
  getCoinRuleById: "/ecommerce/getCoinRuleById",
  deleteCoinRule: "/ecommerce/deleteCoinRule",
  getCoinBalanceByUserId: "/ecommerce/getCoinBalanceByUserId",
  addOrderCustomisation: "/ecommerce/addOrderCustomisation",
  getCustomisationsOrderbySellerId:
    "/ecommerce/getCustomisationsOrderbySellerId",

  createBlog: "/ecommerce/createBlog",
  getBlogs: "/ecommerce/getBlogs",
  getBlogById: "/ecommerce/getBlogById",
  deleteBlog: "/ecommerce/deleteBlog",
  updateBlog: "/ecommerce/updateBlog",

  getProductsByIds: "/ecommerce/getProductsByIds",

  removeOrderedFromCart: "/ecommerce/removeOrderedFromCart",
  cancelUnpaidOrder: "/ecommerce/cancelUnpaidOrder",

  createBanner: "/ecommerce/createBanner",
  getAllBanners: "/ecommerce/getAllBanners",
  deleteBanner: "/ecommerce/deleteBanner",
  updateBanner: "/ecommerce/updateBanner",

  createAnnouncement: "/ecommerce/createAnnouncement",
  getAllAnnouncements: "/ecommerce/getAllAnnouncements",
  updateAnnouncement: "/ecommerce/updateAnnouncement",
  deleteAnnouncement: "/ecommerce/deleteAnnouncement",

  createRefundSetting: "/ecommerce/createRefundSetting",
  updateRefundSetting: "/ecommerce/updateRefundSetting",
  getAllRefundSettings: "/ecommerce/getAllRefundSettings",
  deleteRefundSetting: "/ecommerce/deleteRefundSetting",

  fcmRegistration: "/ecommerce/fcmRegistration",
  canUserRate:"/ecommerce/canUserRate",
  getCashbackHistory:"/ecommerce/getCashbackHistory",

  getSellerApplicationStatus:"/ecommerce/getSellerApplicationStatus"

};

export default endpoints;
