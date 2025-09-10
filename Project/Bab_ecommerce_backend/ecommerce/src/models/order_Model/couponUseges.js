// models/CouponUsage.js
module.exports = (sequelize, DataTypes) => {
  const couponusage = sequelize.define("couponusage", {
    couponId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  return couponusage;
};
