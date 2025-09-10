// models/orderCustomisation.js
module.exports = (sequelize, DataTypes) => {
  const orderCustomisation = sequelize.define("orderCustomisation", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    customData: {
      type: DataTypes.JSON, // {"name":"Amit","size":"M","color":"Red"}
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  return orderCustomisation;
};
