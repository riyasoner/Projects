// models/coin.js
module.exports = (sequelize, DataTypes) => {
  const coin = sequelize.define("coin", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return coin;
};
