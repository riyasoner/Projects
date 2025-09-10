module.exports = (sequelize, DataTypes) => {
  const fcmToken = sequelize.define(
    "fcmToken",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return fcmToken;
};
