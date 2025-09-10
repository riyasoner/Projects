// models/coinRules.model.js
module.exports = (sequelize, DataTypes) => {
  const coinRules = sequelize.define("coinRules", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    actionType: {
      type: DataTypes.STRING, // no ENUM, fully dynamic
      allowNull: false,
    },
    coinsPerAction: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    perAmount: {
      type: DataTypes.INTEGER, // For order placed, e.g., 100 => 5 coins per ₹100
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
    },
  });

  return coinRules;
};
