// models/User.js
module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define("contact", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
  });

  return contact;
};
