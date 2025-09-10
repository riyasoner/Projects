module.exports = (sequelize, DataTypes) => {
  const wishlist = sequelize.define("wishlist", {
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
  });

  return wishlist;
};
