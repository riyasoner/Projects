// models/coinTransaction.js
module.exports = (sequelize, DataTypes) => {
  const coinTransaction = sequelize.define("coinTransaction", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING, // e.g., ORDER_COMPLETED, REFER_FRIEND, DAILY_LOGIN
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM("CREDIT", "DEBIT"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return coinTransaction;
};
