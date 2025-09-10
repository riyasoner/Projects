// models/User.js
module.exports = (sequelize, DataTypes) => {
    const note = sequelize.define('note', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type_of_notes:{
        type: DataTypes.ENUM,
        values: [ "addNote", "task","order" ],
        // defaultValue:"None",
        allowNull: true
      },
      is_postponde : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
      },
      postponded_date : {
        type: DataTypes.DATE,
        allowNull: true
      },
      completed : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
      },
      deleted : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
      }      
    });
    return note;
  }