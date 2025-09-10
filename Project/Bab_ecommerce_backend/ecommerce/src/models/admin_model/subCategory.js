module.exports = (sequelize, DataTypes) => {
  const subCategory = sequelize.define("subCategory", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true, // or false if required
    },
    image: {
      type: DataTypes.STRING, // Will store the image URL or path
      allowNull: true,
    },
  });

  return subCategory;
};
