// models/User.js
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usage_type: {
      type: DataTypes.ENUM,
      values: ["home budget", "business managment"],
      allowNull: true
    },
    usage_mode: {
      type: DataTypes.ENUM,
      values: ["simple", "normal"],
      allowNull: true
    },
    account_unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    time_zone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hide_account: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createrBySuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false

    },
    createdByUserId: {
      type: DataTypes.BIGINT,

    }


  });

  return book;
}