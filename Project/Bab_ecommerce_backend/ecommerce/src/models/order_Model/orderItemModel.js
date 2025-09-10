// models/OrderItem.js
module.exports = (sequelize, DataTypes) => {
  const orderitem = sequelize.define("orderitem", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    subOrderId: {
      type: DataTypes.BIGINT,
      allowNull: true, // optional for backward compatibility
    },

    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    variantId: {
      type: DataTypes.BIGINT,
      allowNull: true, // optional if variant not always required
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.BIGINT,
    },
  });

  return orderitem;
};
