module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userType: {
      type: DataTypes.ENUM("user", "seller", "admin", "admin-employee"),
      defaultValue: "user",
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshTokenExpiration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpVerify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  });

  return user;
};
