module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define("cart", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    variantId: {
      type: DataTypes.BIGINT,
      allowNull: true, 
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    priceAtTheTime: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return cart;
};
