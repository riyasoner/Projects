// models/RefundSetting.js
module.exports = (sequelize, DataTypes) => {
  const refundSetting = sequelize.define("refundSetting", {
    bank: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    wallet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return refundSetting;
};
