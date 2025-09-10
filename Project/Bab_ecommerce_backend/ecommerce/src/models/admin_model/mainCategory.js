module.exports = (sequelize, DataTypes) => {
  const mainCategory = sequelize.define("mainCategory", {
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

  return mainCategory;
};
