// models/User.js
module.exports = (sequelize, DataTypes) => {
    const feedback = sequelize.define('feedback', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
           
    });
  
    return feedback;
  }