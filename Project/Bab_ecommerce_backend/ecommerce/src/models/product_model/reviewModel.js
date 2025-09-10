module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define("review", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return review;
};
