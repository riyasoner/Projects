module.exports = (sequelize, DataTypes) => {
  const userWalletTransaction = sequelize.define("userWalletTransaction", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    walletId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
    },

    type: {
      type: DataTypes.ENUM("CREDIT", "DEBIT"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    balanceType: {
      type: DataTypes.ENUM("REAL", "PROMO"),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
    referenceId: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return userWalletTransaction;
};
