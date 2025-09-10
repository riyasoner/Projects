module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define("payment", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    sellerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    paymentMethod: {
      type: DataTypes.STRING, // 'UPI', 'CARD', 'COD', etc.
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2), // Total amount paid by customer
      allowNull: false,
    },

    commission: {
      type: DataTypes.DECIMAL(10, 2), // Admin commission
      defaultValue: 0.0,
    },

    paymentGatewayFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    tcs: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },

    sellerEarning: {
      type: DataTypes.DECIMAL(10, 2), // Final amount paid to seller
      defaultValue: 0.0,
    },

    payoutStatus: {
      type: DataTypes.ENUM("pending", "processed"),
      defaultValue: "pending",
    },

    payoutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return payment;
};
