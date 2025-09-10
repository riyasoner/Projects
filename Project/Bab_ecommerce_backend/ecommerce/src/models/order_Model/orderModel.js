// models/Order.js
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define("order", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "failed",
        "refunded",
        "wallet_refunded"
      ),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.ENUM(
        "placed",
        "shipped",
        "delivered",
        "cancelled",
        "processing"
      ),
      defaultValue: "placed",
    },
    prepaidDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    coinUsed: {
      type: DataTypes.INTEGER,
    },

    shippingAddressId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    shippingRuleType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "The rule applied like 'flat_rate', 'free_above', etc.",
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    couponDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cod", "online", "wallet", "wallet+online"),
      allowNull: false,
      defaultValue: "cod",
    },

    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Stores Razorpay order ID if payment is online",
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
    },
    refundId: {
      type: DataTypes.STRING,
    },
    cancellationReason: {
      type: DataTypes.STRING,
    },
    walletRealUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    walletPromoUsed: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    walletRealPending: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    walletPromoPending: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  return order;
};
