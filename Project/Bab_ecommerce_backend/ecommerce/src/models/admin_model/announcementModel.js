module.exports = (sequelize, DataTypes) => {
  const announcement = sequelize.define("announcement", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return announcement;
};
