// models/User.js
module.exports = (sequelize, DataTypes) => {
    const setting = sequelize.define('setting', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      time_zone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email_id:{
        type: DataTypes.STRING,
        allowNull: true
      },
      phone_no : {
        type: DataTypes.STRING,
        allowNull: true
      },
      subscription : {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_name : {
        type: DataTypes.STRING,
        allowNull: true
      },
      surname : {
        type: DataTypes.STRING,
        allowNull: true
      },
      password : {
        type: DataTypes.STRING,
        allowNull: true
      },
      new_password : {
        type: DataTypes.STRING,
        allowNull: true
      }, 
      confirm_new_password : {
        type: DataTypes.STRING,
        allowNull: true
      }      
    });
  
    return setting;
  }