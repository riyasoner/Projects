module.exports = (sequelize, DataTypes) => {
  const payoutRequest = sequelize.define("payoutRequest", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sellerId: {
      type: DataTypes.BIGINT,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    processed_at: {
      type: DataTypes.DATE,
    },
  });

  return payoutRequest;
};
