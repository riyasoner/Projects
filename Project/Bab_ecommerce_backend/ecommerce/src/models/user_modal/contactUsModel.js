// models/contactUs.js

module.exports = (sequelize, DataTypes) => {
  const contactUs = sequelize.define("contactUs", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return contactUs;
};
