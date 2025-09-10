// models/User.js
module.exports = (sequelize, DataTypes) => {
    const alloted_book = sequelize.define('alloted_book', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      assign_by : {
        type: DataTypes.STRING,
        allowNull: true
      },
      read_book: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      create_book: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      update_book: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      delete_book: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
              
    });
  
    return alloted_book;
  }