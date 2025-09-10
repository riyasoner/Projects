module.exports = (sequelize, DataTypes) => {
  const adminFeeConfig = sequelize.define("adminFeeConfig", {
    feeType: {
      type: DataTypes.STRING,
    },
    amountType: {
      type: DataTypes.ENUM("fixed", "percentage"),
    },
    amountValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    adminId: {
      type: DataTypes.BIGINT,
    },
  });
  return adminFeeConfig;
};
