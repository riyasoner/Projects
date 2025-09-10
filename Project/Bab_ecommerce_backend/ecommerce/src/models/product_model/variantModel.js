// models/variant.js

module.exports = (sequelize, DataTypes) => {
  const variant = sequelize.define("variant", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    variantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    storage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sku: {
      type: DataTypes.STRING,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    discountPercent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
    },

    variantImages: {
      type: DataTypes.JSON, // Array of image URLs
      allowNull: true,
    },
  });

  return variant;
};
