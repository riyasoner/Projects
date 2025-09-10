module.exports = (sequelize, DataTypes) => {
  const wallet = sequelize.define("wallet", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sellerId: {
      type: DataTypes.BIGINT,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    withdrawnAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    pending_balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD", // or 'USD' depending on your default
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return wallet;
};
