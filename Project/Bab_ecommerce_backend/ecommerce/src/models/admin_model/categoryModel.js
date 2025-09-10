// models/category.js
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define("category", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
    },
    mainCategoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // Will store the image URL or path
      allowNull: true,
    },
  });

  return category;
};
