// models/shippingFee.model.js

module.exports = (sequelize, DataTypes) => {
  const shippingFee = sequelize.define("shippingFee", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    shippingType: {
      type: DataTypes.ENUM(
        "flat_rate",
        "free_above",
        "location_based",
        "weight_based"
      ),
      allowNull: false,
      defaultValue: "flat_rate",
    },

    flatRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Used if type is flat_rate",
    },

    freeAboveAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Used if type is free_above",
    },

    weightRatePerKg: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Used if type is weight_based",
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Used if type is location_based",
    },

    locationFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Shipping fee for location-based rule",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return shippingFee;
};
