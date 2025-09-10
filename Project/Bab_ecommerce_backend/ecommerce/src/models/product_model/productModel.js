// models/product.js

const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define("product", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    prepaidDiscountType: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: true,
      defaultValue: null,
    },
    prepaidDiscountValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    categoryId: {
      type: DataTypes.BIGINT,
    },
    mainCategoryId: {
      type: DataTypes.BIGINT,
    },

    subCategoryId: {
      type: DataTypes.BIGINT,
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    addedBy: {
      type: DataTypes.ENUM("admin", "seller"),
      defaultValue: "seller",
    },

    sellerId: {
      type: DataTypes.BIGINT,
    },

    adminId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    discountPercent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    warranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    returnPolicy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    shippingInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },

    approvalReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    shareableLink: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    isCustomisable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isCustomisableNote: {
      type: DataTypes.STRING,
    },
    customFields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    paymentOptions: {
      type: DataTypes.JSON,
    },
  });

  // 👇 Auto-generate slug and shareableLink before create
  product.beforeCreate((product) => {
    const baseSlug = slugify(product.title, { lower: true, strict: true });
    const randomStr = uuidv4().split("-")[0]; // Short unique string
    product.slug = baseSlug;
    product.shareableLink = `${baseSlug}-${randomStr}`;
  });

  return product;
};
