// models/Coupon.js
module.exports = (sequelize, DataTypes) => {
  const coupon = sequelize.define("coupon", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    discountType: {
      type: DataTypes.ENUM("percent", "amount"), // % or ₹
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minOrderValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    maxDiscount: {
      type: DataTypes.DECIMAL(10, 2), // for % type
      allowNull: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER, // total usage
      defaultValue: 1,
    },
    usagePerUser: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "expired"),
      defaultValue: "active",
    },

    // Optional: Who created it (Admin/Seller)
    sellerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "Null means created by Admin, otherwise seller ID",
    },
    appliedOnType: {
      type: DataTypes.ENUM(
        "product",
        "subCategory",
        "category",
        "mainCategory",
        "all"
      ),
      comment: "Defines where this coupon is applied",
    },
    appliedOnId: {
      type: DataTypes.BIGINT,
      comment: "ID of the product/category/subcategory/mainCategory",
    },
    createdByAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return coupon;
};
