module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define("address", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "India",
    },

    type: {
      type: DataTypes.ENUM("home", "work", "other"),
      defaultValue: "home",
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return address;
};
