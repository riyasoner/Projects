module.exports = (sequelize, DataTypes) => {
  const customerRating = sequelize.define("customerRating", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER, // 1 to 5 stars
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // By default, not approved
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return customerRating;
};
