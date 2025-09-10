// models/User.js
module.exports = (sequelize, DataTypes) => {
    const alloted_account = sequelize.define('alloted_account', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      assign_by : {
        type: DataTypes.STRING,
        allowNull: true
      },       
    });
  
    return alloted_account;
  }