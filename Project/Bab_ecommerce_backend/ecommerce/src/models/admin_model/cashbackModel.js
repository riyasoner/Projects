module.exports = (sequelize, DataTypes) => {
  const CashbackRule = sequelize.define("cashbackRule", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cashbackType: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    cashbackValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minPurchaseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    applicableCategories: {
      type: DataTypes.JSON, // Use JSON to store array of category IDs
      allowNull: true,
    },
    applicableProducts: {
      type: DataTypes.JSON, // Use JSON to store array of product IDs
      allowNull: true,
    },
    paymentMethods: {
      type: DataTypes.JSON, // Use JSON to store array of payment method strings
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiryDays: {
      type: DataTypes.INTEGER,
      allowNull: true, // null = no expiry
      defaultValue: 90, // e.g., 90 days from earned date
    },
  });

  return CashbackRule;
};
