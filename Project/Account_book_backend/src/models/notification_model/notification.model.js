// models/User.js
module.exports = (sequelize, DataTypes) => {
    const notification = sequelize.define('notification', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true
      },
    type : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      target_id : {
        type: DataTypes.STRING,
        allowNull: true
      },
      source_id : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title : {
        type: DataTypes.STRING  ,
        allowNull: true,
      },
      transaction_id : {
        type: DataTypes.STRING,
        allowNull: true
      }

    });
    return notification;
  }