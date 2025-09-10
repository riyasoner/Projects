// models/User.js
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define("category", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upper_category: {
      type: DataTypes.ENUM,
      values: ["None", "Office Expense"],
      defaultValue: "None",
    },
    monthly_limit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
  });

  return category;
};
