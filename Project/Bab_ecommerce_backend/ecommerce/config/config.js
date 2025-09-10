require("dotenv").config();
const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("../src/models/user_modal/userModel")(sequelize, DataTypes);
db.sellerProfile = require("../src/models/seller_model/sellerModel")(
  sequelize,
  DataTypes
);
db.category = require("../src/models/admin_model/categoryModel")(
  sequelize,
  DataTypes
);
db.mainCategory = require("../src/models/admin_model/mainCategory")(
  sequelize,
  DataTypes
);
db.subCategory = require("../src/models/admin_model/subCategory")(
  sequelize,
  DataTypes
);
db.product = require("../src/models/product_model/productModel")(
  sequelize,
  DataTypes
);
db.variant = require("../src/models/product_model/variantModel")(
  sequelize,
  DataTypes
);
db.wishlist = require("../src/models/product_model/wishlistModel")(
  sequelize,
  DataTypes
);
db.cart = require("../src/models/product_model/cartModel")(
  sequelize,
  DataTypes
);
db.review = require("../src/models/product_model/reviewModel")(
  sequelize,
  DataTypes
);
db.inventory = require("../src/models/product_model/inventoryModel")(
  sequelize,
  DataTypes
);
db.address = require("../src/models/product_model/address.model")(
  sequelize,
  DataTypes
);
db.order = require("../src/models/order_Model/orderModel")(
  sequelize,
  DataTypes
);
db.orderitem = require("../src/models/order_Model/orderItemModel")(
  sequelize,
  DataTypes
);
db.coupon = require("../src/models/order_Model/couponModel")(
  sequelize,
  DataTypes
);
db.couponusage = require("../src/models/order_Model/couponUseges")(
  sequelize,
  DataTypes
);
db.supportTicket = require("../src/models/order_Model/supportTicketModel")(
  sequelize,
  DataTypes
);
db.supportTicketReply = require("../src/models/order_Model/supportTicketReply")(
  sequelize,
  DataTypes
);
db.payment = require("../src/models/payment_model/paymentModel")(
  sequelize,
  DataTypes
);
db.shippingFee = require("../src/models/product_model/shippingFeeModel")(
  sequelize,
  DataTypes
);

db.adminFeeConfig = require("../src/models/admin_model/adminFeeModel")(
  sequelize,
  DataTypes
);
db.payoutRequest = require("../src/models/seller_model/payoutmodel")(
  sequelize,
  DataTypes
);
db.wallet = require("../src/models/seller_model/walletModel")(
  sequelize,
  DataTypes
);
db.walletTransaction =
  require("../src/models/seller_model/walletTransactionModel")(
    sequelize,
    DataTypes
  );
db.suborder = require("../src/models/order_Model/suborderModel")(
  sequelize,
  DataTypes
);
db.contactUs = require("../src/models/user_modal/contactUsModel")(
  sequelize,
  DataTypes
);
db.faq = require("../src/models/user_modal/faqModel")(sequelize, DataTypes);
db.customerRating = require("../src/models/user_modal/customerRating")(
  sequelize,
  DataTypes
);
db.userWallet = require("../src/models/user_modal/userWalletModel")(
  sequelize,
  DataTypes
);
db.userWalletTransaction =
  require("../src/models/user_modal/userWalletTransaction")(
    sequelize,
    DataTypes
  );
db.cashbackRule = require("../src/models/admin_model/cashbackModel")(
  sequelize,
  DataTypes
);
db.cashback = require("../src/models/admin_model/userCashbackModel")(
  sequelize,
  DataTypes
);
db.coinRules = require("../src/models/admin_model/userCoinRuleModel")(
  sequelize,
  DataTypes
);
db.coin = require("../src/models/admin_model/userCoinModel")(
  sequelize,
  DataTypes
);
db.coinTransaction =
  require("../src/models/admin_model/userCoinTransactionModel")(
    sequelize,
    DataTypes
  );
db.orderCustomisation = require("../src/models/order_Model/orderCustomisation")(
  sequelize,
  DataTypes
);
db.blog = require("../src/models/product_model/blogModel")(
  sequelize,
  DataTypes
);
db.banner = require("../src/models/admin_model/bannerModel")(
  sequelize,
  DataTypes
);
db.announcement = require("../src/models/admin_model/announcementModel")(
  sequelize,
  DataTypes
);
db.refundSetting = require("../src/models/admin_model/refundSettngModel")(
  sequelize,
  DataTypes
);
db.fcmToken = require("../src/models/user_modal/fcmTokenModel")(
  sequelize,
  DataTypes
);
require("../config/association")(db);
(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection has been established successfully with the database."
    );
    await sequelize.sync({ alter: true });
    console.log("Models synchronized.");
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
})();

module.exports = db;
