module.exports = (sequelize, DataTypes) => {
  const userWallet = sequelize.define("userWallet", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    realBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    promoBalance: {
      // for cashback/non-withdrawable credits
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    withdrawnAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    pendingBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return userWallet;
};
