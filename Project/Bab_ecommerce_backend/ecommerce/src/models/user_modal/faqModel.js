// models/faq.model.js

module.exports = (sequelize, DataTypes) => {
  const faq = sequelize.define("faq", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
    },
    answer: {
      type: DataTypes.TEXT,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    variantId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return faq;
};
