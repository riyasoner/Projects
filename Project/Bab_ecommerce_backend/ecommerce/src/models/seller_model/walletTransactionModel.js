module.exports = (sequelize, DataTypes) => {
  const walletTransaction = sequelize.define("walletTransaction", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sellerId: {
      type: DataTypes.BIGINT,
    },
    type: {
      type: DataTypes.ENUM("credit", "debit"),
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    reason: {
      type: DataTypes.STRING,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "rejected"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    suborderId: {
      type: DataTypes.BIGINT,
    },
  });

  return walletTransaction;
};
