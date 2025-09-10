module.exports = (sequelize, DataTypes) => {
  const cashback = sequelize.define("cashback", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    suborderId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cashbackRuleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "approved",
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return cashback;
};
