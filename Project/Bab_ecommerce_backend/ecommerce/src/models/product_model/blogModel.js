module.exports = (sequelize, DataTypes) => {
  const blog = sequelize.define("blog", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
    },

    slug: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT("long"),
    },

    excerpt: {
      type: DataTypes.STRING(500),
    },

    images: {
      type: DataTypes.JSON,
    },

    categoryId: {
      type: DataTypes.BIGINT,
    },

    createdBy: {
      type: DataTypes.BIGINT,
    },

    productId: {
      type: DataTypes.BIGINT,
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "pending",
        "approved",
        "rejected",
        "published"
      ),
      defaultValue: "draft",
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    tags: {
      type: DataTypes.JSON,
    },

    metaTitle: {
      type: DataTypes.STRING,
    },

    metaDescription: {
      type: DataTypes.STRING(300),
    },

    metaKeywords: {
      type: DataTypes.STRING,
    },
  });

  return blog;
};
