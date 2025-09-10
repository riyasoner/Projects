module.exports = (sequelize, DataTypes) => {
  const banner = sequelize.define("banner", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    bannerImage: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return banner;
};
