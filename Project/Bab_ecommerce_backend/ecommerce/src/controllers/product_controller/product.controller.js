const db = require("../../../config/config");

const product = db.product;
const variant = db.variant;
const sequelize = db.sequelize;
const { Op, Sequelize } = require("sequelize");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const category = db.category;
const Product = db.product;
const review = db.review;
const Variant = db.variant;
const mainCategory = db.mainCategory;
const subCategory = db.subCategory;

exports.createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      title,
      description,
      categoryId,
      mainCategoryId,
      subCategoryId,
      prepaidDiscountType,
      prepaidDiscountValue,
      brand,
      price,
      discountPercent,
      sku,
      features,
      specifications,
      warranty,
      returnPolicy,
      shippingInfo,
      addedBy,
      sellerId,
      adminId,
      stock,
      about,
      isCustomisable,
      customFields,
      paymentOptions,
      keywords,
      isCustomisableNote,
    } = req.body;
    const variants = JSON.parse(req.body.variants || "[]");

    if (!title || !categoryId || !price || !sku) {
      return res.status(400).json({
        status: false,
        message: "Required fields: title, categoryId, price, sku",
      });
    }
    if (addedBy === "seller" && !sellerId) {
      return res.status(400).json({
        status: false,
        message: "Seller ID is required when addedBy is 'seller'",
      });
    }

    // ✅ Generate slug and shareableLink
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slug = baseSlug;

    // ✅ Check if slug already exists
    const existingProduct = await product.findOne({ where: { slug } });
    if (existingProduct) {
      return res.status(409).json({
        status: false,
        message: `Product with slug "${slug}" already exists. Please choose a different title.`,
      });
    }
    const existingSKU = await product.findOne({ where: { sku } });
    if (existingSKU) {
      return res.status(409).json({
        status: false,
        message: `Product with SKU "${sku}" already exists. Please use a different SKU.`,
      });
    }
    // Check mainCategoryId exists
    const mainCat = await db.mainCategory.findByPk(mainCategoryId);
    if (!mainCat) {
      return res.status(400).json({
        status: false,
        message: "Invalid mainCategoryId",
      });
    }

    // Check categoryId exists and belongs to mainCategoryId
    const cat = await db.category.findOne({
      where: { id: categoryId, mainCategoryId },
    });
    if (!cat) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid categoryId or category doesn't belong to mainCategory",
      });
    }

    // Check subCategoryId exists and belongs to categoryId
    const subCat = await db.subCategory.findOne({
      where: { id: subCategoryId, categoryId },
    });
    if (!subCat) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid subCategoryId or subcategory doesn't belong to category",
      });
    }

    const shareableLink = `${baseSlug}-${uuidv4().split("-")[0]}`;
    const mainImageFile = req.files?.find(
      (file) => file.fieldname === "mainImage"
    );
    const mainImage = mainImageFile
      ? `/mainImage/${mainImageFile.filename}`
      : null;

    const productImages = Array.isArray(req.files)
      ? req.files
          .filter((file) => file.fieldname === "productImages")
          .map((file) => `/productImages/${file.filename}`)
      : [];
    const newProduct = await product.create(
      {
        title,
        slug,
        description,
        categoryId,
        mainCategoryId,
        subCategoryId,
        brand,
        price,
        discountPercent: discountPercent || 0,
        sku,
        // ✅ Parse features
        features: (() => {
          if (!features) return [];
          if (Array.isArray(features)) return features; // already array
          try {
            return JSON.parse(features); // form-data JSON string
          } catch {
            return [];
          }
        })(),

        // ✅ Parse specifications
        specifications: (() => {
          if (!specifications) return {};
          if (typeof specifications === "object") return specifications; // already object
          try {
            return JSON.parse(specifications);
          } catch {
            return {};
          }
        })(),
        warranty,
        returnPolicy,
        shippingInfo,
        addedBy: addedBy || "seller",
        sellerId: addedBy === "seller" ? sellerId : adminId,
        adminId: addedBy === "admin" ? adminId : sellerId,
        images: productImages,
        mainImage,
        shareableLink,
        stock,
        about,
        prepaidDiscountType,
        prepaidDiscountValue,
        isCustomisable: isCustomisable || false,
        customFields: (() => {
          if (!customFields) return [];
          if (Array.isArray(customFields)) return customFields;
          try {
            return JSON.parse(customFields); // form-data me aaya JSON string ko parse karega
          } catch {
            return [];
          }
        })(),
        paymentOptions: (() => {
          if (!req.body.paymentOptions) return [];
          if (Array.isArray(req.body.paymentOptions))
            return req.body.paymentOptions;
          try {
            return JSON.parse(req.body.paymentOptions); // agar form-data string me aaye
          } catch {
            return [];
          }
        })(),
        keywords: (() => {
          if (!req.body.keywords) return [];
          if (Array.isArray(req.body.keywords)) return req.body.keywords;
          try {
            return JSON.parse(req.body.keywords); // agar form-data string me aaye
          } catch {
            return [];
          }
        })(),
        isCustomisableNote,
      },
      { transaction: t }
    );

    // ✅ Create variants
    if (Array.isArray(variants) && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const variantObj = variants[i];

        const variantImagePaths = Array.isArray(req.files)
          ? req.files
              .filter((file) => file.fieldname === `variantImages[${i}]`)
              .map((file) => `/variantImages/${file.filename}`)
          : [];
        await variant.create(
          {
            ...variantObj,
            productId: newProduct.id,
            variantImages: variantImagePaths,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error in createProduct:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while creating product",
    });
  }
};

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      categoryId,
      mainCategoryId,
      subCategoryId,
      sellerId,
      status,
      minPrice,
      maxPrice,
      color,
      size,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      order = "DESC",
      sku,
      productId,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // ✅ Product-level filters
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (categoryId) where.categoryId = categoryId;
    if (mainCategoryId) where.mainCategoryId = mainCategoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (sellerId) where.sellerId = sellerId;
    if (productId) where.id = productId;
    if (status) where.status = status;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // ✅ Variant-level filters
    const variantWhere = {};
    if (color) variantWhere.color = color;
    if (size) variantWhere.size = size;
    if (sku) variantWhere.sku = sku;

    if (minPrice || maxPrice) {
      variantWhere.price = {};
      if (minPrice) variantWhere.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) variantWhere.price[Op.lte] = parseFloat(maxPrice);
    }

    // ✅ Query with associations
    const products = await product.findAndCountAll({
      where,
      include: [
        {
          model: category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: mainCategory,
          as: "mainCategory",
          attributes: ["id", "name"],
        },
        {
          model: subCategory,
          as: "subCategory",
          attributes: ["id", "name"],
        },
        {
          model: variant,
          as: "variants",
          where:
            Object.keys(variantWhere).length > 0 ? variantWhere : undefined,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: review,
          as: "reviews",
          attributes: ["id", "rating"], // sirf rating chahiye
        },
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Format products
    const updatedProducts = products.rows.map((prod) => {
      const prodJSON = prod.toJSON();
      const totalReviews = prodJSON.reviews ? prodJSON.reviews.length : 0;
      const totalRating = (prodJSON.reviews || []).reduce(
        (sum, r) => sum + (r.rating || 0),
        0
      );
      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";

      // ✅ remove raw reviews agar chhupana hai
      delete prodJSON.reviews;

      prodJSON.features = safeParse(prodJSON.features, []);
      prodJSON.specifications = safeParse(prodJSON.specifications, {});
      prodJSON.customFields = safeParse(prodJSON.customFields, []);
      prodJSON.paymentOptions = safeParse(prodJSON.paymentOptions, []);
      prodJSON.keywords = safeParse(prodJSON.keywords, []);
      // ✅ Product images
      const rawImages = safeParse(prodJSON.images, []);
      const fullProductImages = Array.isArray(rawImages)
        ? rawImages.map((img) => `${hostUrl}${img}`)
        : [];

      // ✅ Variants
      const updatedVariants = (prodJSON.variants || []).map((variant) => {
        let variantImgs = [];
        console.log(prodJSON.variants);
        // Parse JSON string safely
        try {
          variantImgs = variant.variantImages
            ? JSON.parse(variant.variantImages)
            : [];
        } catch (err) {
          variantImgs = [];
        }

        // Convert each image to full URL
        const fullVariantImages = variantImgs.map((img) => `${hostUrl}${img}`);

        return {
          ...variant,
          variantImages: fullVariantImages, // keep the key same as DB
        };
      });
      return {
        ...prodJSON,
        images: fullProductImages,
        variants: updatedVariants,
        mainImage: prodJSON.mainImage
          ? `${hostUrl}${prodJSON.mainImage}`
          : null,
        shareableLink: `${process.env.FRONTEND_URL}/ecommerce/product/${prodJSON.shareableLink}`,
        totalReviews,
        averageRating,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      total: products.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(products.count / limit),
      data: updatedProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching products",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const prod = await product.findOne({
      where: { id },
      include: [
        {
          model: category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: variant,
          as: "variants",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: review,
          as: "reviews",
          attributes: ["rating"],
        },
      ],
    });

    if (!prod) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    const hostUrl = `${req.protocol}://${req.get("host")}`;
    const finalProduct = prod.toJSON();

    // ✅ Parse JSON fields safely (stored as DataTypes.JSON, but might come as string if inserted via raw SQL/form-data)
    finalProduct.features = safeParse(finalProduct.features, []);
    finalProduct.customFields = safeParse(finalProduct.customFields, []);
    finalProduct.specifications = safeParse(finalProduct.specifications, {});
    finalProduct.paymentOptions = safeParse(finalProduct.paymentOptions, []);
    finalProduct.keywords = safeParse(finalProduct.keywords, []);
    // ✅ Format product images
    const rawImages = safeParse(finalProduct.images, []);
    finalProduct.images = Array.isArray(rawImages)
      ? rawImages.map((img) => `${hostUrl}${img}`)
      : [];

    // ✅ Format main image
    finalProduct.mainImage = finalProduct.mainImage
      ? `${hostUrl}${finalProduct.mainImage}`
      : null;

    // ✅ Format variant images
    finalProduct.variants = (finalProduct.variants || []).map((v) => {
      const variantImgs = safeParse(v.variantImages, []);
      v.images = Array.isArray(variantImgs)
        ? variantImgs.map((img) => `${hostUrl}${img}`)
        : [];
      return v;
    });

    // ✅ Calculate total reviews and average rating
    const totalReviews = finalProduct.reviews?.length || 0;
    const totalRating = (finalProduct.reviews || []).reduce(
      (sum, r) => sum + (r.rating || 0),
      0
    );
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Remove raw reviews if you don’t want to expose ratings array
    delete finalProduct.reviews;

    return res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: {
        ...finalProduct,
        totalReviews,
        averageRating: averageRating.toFixed(1),
      },
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching product",
    });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      categoryId,
      brand,
      price,
      discountPercent,
      stock,
      sku,
      features,
      specifications,
      warranty,
      returnPolicy,
      shippingInfo,
      status,
      isCustomisable,
      customFields,
      paymentOptions,
      keywords,
      isCustomisableNote,
    } = req.body;

    const prod = await product.findByPk(id);

    if (!prod) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    // ✅ Handle uploaded images (replace if new uploaded)
    let productImages = prod.images || [];
    if (req.files && req.files.length > 0) {
      productImages = req.files
        .filter((file) => file.fieldname === "productImages")
        .map((file) => `/productImages/${file.filename}`);
    }

    // ✅ Helper: Safe parse JSON or fallback
    const safeParse = (data, fallback, forceArray = false) => {
      if (!data) return fallback;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (forceArray && !Array.isArray(parsed)) return [parsed];
          return parsed;
        } catch {
          return forceArray ? [data] : fallback;
        }
      }
      if (forceArray && !Array.isArray(data)) return [data];
      return data;
    };

    const parsedFeatures = safeParse(features, [], true);
    const parsedSpecs = safeParse(specifications, {}, false);
    const parsedCustomFields = safeParse(customFields, [], true);
    const parsedPaymentOptions = safeParse(
      paymentOptions,
      prod.paymentOptions || [],
      true
    );
    const keywordsParse = safeParse(keywords, [], true);

    // ✅ Update the product
    await prod.update({
      title,
      description,
      categoryId,
      brand,
      price,
      discountPercent,
      stock,
      sku,
      features: parsedFeatures,
      specifications: parsedSpecs,
      warranty,
      returnPolicy,
      shippingInfo,
      status,
      images: productImages,
      isCustomisable,
      customFields: parsedCustomFields,
      paymentOptions: parsedPaymentOptions,
      keywords: keywordsParse,
      isCustomisableNote,
    });

    // ✅ Fetch updated product to return
    const updatedProd = await product.findByPk(id);

    return res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProd,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while updating product",
    });
  }
};
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const prod = await product.findByPk(id);

    if (!prod) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    await prod.destroy(); // 🔥 deletes the product from DB

    return res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while deleting product",
    });
  }
};

exports.getProductByShareableLink = async (req, res) => {
  try {
    const { shareableLink } = req.params;

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const foundProduct = await product.findOne({
      where: { shareableLink },
      include: [
        {
          model: category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: variant,
          as: "variants",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    if (!foundProduct) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    const prodJSON = foundProduct.toJSON();

    // ✅ Parse product images
    let rawImages = prodJSON.images;
    if (typeof rawImages === "string") {
      try {
        rawImages = JSON.parse(rawImages);
      } catch {
        rawImages = [];
      }
    }

    const fullProductImages = Array.isArray(rawImages)
      ? rawImages.map((img) => `${hostUrl}${img}`)
      : [];

    // ✅ Parse variant images
    const updatedVariants = prodJSON.variants.map((variant) => {
      let variantImgs = variant.variantImages;

      if (typeof variantImgs === "string") {
        try {
          variantImgs = JSON.parse(variantImgs);
        } catch {
          variantImgs = [];
        }
      }

      const fullVariantImages = Array.isArray(variantImgs)
        ? variantImgs.map((img) => `${hostUrl}${img}`)
        : [];

      return {
        ...variant,
        images: fullVariantImages,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: {
        ...prodJSON,
        images: fullProductImages,
        variants: updatedVariants,
        shareableLink: `${hostUrl}/product/${prodJSON.shareableLink}`,
      },
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching product",
    });
  }
};

// Create or Update Variant
exports.updateVariant = async (req, res) => {
  try {
    const {
      productId,
      variantName,
      color,
      size,
      storage,
      sku,
      price,
      discountPercent,
      stock,
    } = req.body;

    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "Variant ID is required for update" });
    }

    const existing = await variant.findByPk(id);
    if (!existing) {
      return res
        .status(404)
        .json({ status: false, message: "Variant not found" });
    }

    // ✅ Get variantImages from uploaded files
    let variantImages = [];

    if (req.files && req.files.length > 0) {
      variantImages = req.files
        .filter((file) => /^variantImages/.test(file.fieldname))
        .map((file) => `/variantImages/${file.filename}`);
    }

    const variantData = {
      productId,
      variantName,
      color,
      size,
      storage,
      sku,
      price,
      discountPercent,
      stock,
      variantImages:
        variantImages.length > 0 ? variantImages : existing.variantImages, // retain existing if not uploaded
    };

    await existing.update(variantData);

    return res.status(200).json({
      status: true,
      message: "Variant updated successfully",
      data: existing,
    });
  } catch (err) {
    console.error("Error updating variant:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
// Delete Variant
exports.deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await variant.findByPk(id);
    if (!existing) {
      return res
        .status(404)
        .json({ status: false, message: "Variant not found" });
    }

    await existing.destroy();
    return res
      .status(200)
      .json({ status: true, message: "Variant deleted successfully" });
  } catch (err) {
    console.error("Error deleting variant:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
// Get Variant by ID
exports.getVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    const found = await variant.findByPk(id);
    if (!found) {
      return res
        .status(404)
        .json({ status: false, message: "Variant not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Variant fetched", data: found });
  } catch (err) {
    console.error("Error fetching variant:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// exports.getRelatedProducts = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const Product = await product.findByPk(productId);

//     if (!Product) {
//       return res.status(404).json({
//         status: false,
//         message: "Product not found",
//       });
//     }

//     let relatedProducts = [];

//     // 🔍 Step 1: Try to fetch related products by categoryId
//     relatedProducts = await product.findAll({
//       where: {
//         categoryId: Product.categoryId,
//         id: { [Op.ne]: productId },
//         status: "active",
//       },
//       include: [{ model: Variant, as: "variants" }],
//       limit: 10,
//       order: [["createdAt", "DESC"]],
//     });

//     // 🔄 Step 2: If no related products by categoryId, try subCategoryId
//     if (relatedProducts.length === 0 && Product.subCategoryId) {
//       relatedProducts = await product.findAll({
//         where: {
//           subCategoryId: Product.subCategoryId,
//           id: { [Op.ne]: productId },
//           status: "active",
//         },
//         include: [{ model: Variant, as: "variants" }],
//         limit: 10,
//         order: [["createdAt", "DESC"]],
//       });
//     }

//     // 🔄 Step 3: If still empty, try mainCategoryId
//     if (relatedProducts.length === 0 && Product.mainCategoryId) {
//       relatedProducts = await product.findAll({
//         where: {
//           mainCategoryId: Product.mainCategoryId,
//           id: { [Op.ne]: productId },
//           status: "active",
//         },
//         include: [{ model: Variant, as: "variants" }],
//         limit: 10,
//         order: [["createdAt", "DESC"]],
//       });
//     }

//     // 🔃 Format response
//     const formattedProducts = relatedProducts.map((prod) => {
//       const jsonProduct = prod.toJSON();

//       // 📷 Parse product images
//       let productImageUrls = [];
//       try {
//         const parsedImages =
//           typeof jsonProduct.images === "string"
//             ? JSON.parse(jsonProduct.images)
//             : Array.isArray(jsonProduct.images)
//             ? jsonProduct.images
//             : [];

//         productImageUrls = parsedImages.map((img) =>
//           img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
//         );
//       } catch (err) {
//         console.error(
//           `Failed to parse product images for product ${jsonProduct.id}:`,
//           err.message
//         );
//       }

//       // 🎨 Parse variant images
//       const variantsWithImages = (jsonProduct.variants || []).map((variant) => {
//         let variantImageUrls = [];

//         try {
//           const parsedVariantImages =
//             typeof variant.variantImages === "string"
//               ? JSON.parse(variant.variantImages)
//               : Array.isArray(variant.variantImages)
//               ? variant.variantImages
//               : [];

//           variantImageUrls = parsedVariantImages.map((img) =>
//             img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
//           );
//         } catch (err) {
//           console.error(
//             `Failed to parse variant images for variant ${variant.id}:`,
//             err.message
//           );
//         }

//         return {
//           ...variant,
//           imageUrls: variantImageUrls,
//           thumbnail: variantImageUrls[0] || null,
//         };
//       });

//       return {
//         ...jsonProduct,
//         url: `${baseUrl}/product/${jsonProduct.slug || jsonProduct.id}`,
//         imageUrls: productImageUrls,
//         thumbnail: productImageUrls[0] || null,
//         variants: variantsWithImages,
//       };
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Related products fetched successfully",
//       data: formattedProducts,
//     });
//   } catch (error) {
//     console.error("Related Product Error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error",
//     });
//   }
// };

exports.getOnSaleProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        discountPercent: { [Op.gt]: 0 },
        status: "active",
      },
      order: [["updatedAt", "DESC"]],
      offset,
      limit,
      include: [
        {
          model: Variant,
          as: "variants",
        },
        {
          model: review, // ✅ make sure relation is Product.hasMany(review, { as: "reviews" })
          as: "reviews",
          attributes: ["id", "rating"],
        },
      ],
    });

    const products = rows.map((product) => {
      const jsonProduct = product.toJSON();
      // ⭐ Review calculation
      const totalReviews = Array.isArray(jsonProduct.reviews)
        ? jsonProduct.reviews.length
        : 0;

      const totalRating = (jsonProduct.reviews || []).reduce((sum, r) => {
        const rating = parseFloat(r.rating ?? 0);
        return sum + (isNaN(rating) ? 0 : rating);
      }, 0);

      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";

      delete jsonProduct.reviews; // raw reviews remove

      // Parse product images
      let productImageUrls = [];
      try {
        const rawImages = jsonProduct.images;
        const parsedImages =
          typeof rawImages === "string"
            ? JSON.parse(rawImages)
            : Array.isArray(rawImages)
            ? rawImages
            : [];

        productImageUrls = parsedImages.map((img) =>
          img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
        );
      } catch (err) {
        console.error(
          `Failed to parse product images for ID ${jsonProduct.id}:`,
          err.message
        );
      }

      // Format variants
      const formattedVariants = (jsonProduct.variants || []).map((variant) => {
        let variantImageUrls = [];
        try {
          const rawVariantImages = variant.variantImages;
          const parsedVariantImages =
            typeof rawVariantImages === "string"
              ? JSON.parse(rawVariantImages)
              : Array.isArray(rawVariantImages)
              ? rawVariantImages
              : [];

          variantImageUrls = parsedVariantImages.map((img) =>
            img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
          );
        } catch (err) {
          console.error(
            `Failed to parse variant images for ID ${variant.id}:`,
            err.message
          );
        }

        return {
          ...variant,
          variantImages: variantImageUrls,
          thumbnail: variantImageUrls.length > 0 ? variantImageUrls[0] : null,
        };
      });

      // Final product return
      return {
        ...jsonProduct,
        images: productImageUrls,
        thumbnail: productImageUrls.length > 0 ? productImageUrls[0] : null,
        url: `${baseUrl}/product/${jsonProduct.slug || jsonProduct.id}`,
        variants: formattedVariants,
        totalReviews,
        averageRating,
      };
    });

    return res.status(200).json({
      status: true,
      products,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching on-sale products:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
exports.getNewArrivalProducts = async (req, res) => {
  try {
    const recentDays = 30;
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - recentDays);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: dateThreshold,
        },
        status: "active",
      },
      order: [["createdAt", "DESC"]],
      offset,
      limit,
      include: [
        {
          model: Variant,
          as: "variants",
        },
        {
          model: review,
          as: "reviews",
          attributes: ["id", "rating"], // sirf id aur rating lena hai
        },
      ],
    });

    const products = rows.map((product) => {
      const jsonProduct = product.toJSON();
      // ⭐ Review calculation
      const totalReviews = jsonProduct.reviews ? jsonProduct.reviews.length : 0;
      const totalRating = (jsonProduct.reviews || []).reduce(
        (sum, r) => sum + (parseFloat(r.rating) || 0),
        0
      );
      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";
      // Agar raw reviews response me nahi bhejna hai to hata do
      delete jsonProduct.reviews;

      // Parse and update main product images
      try {
        const parsedImages =
          typeof jsonProduct.images === "string"
            ? JSON.parse(jsonProduct.images)
            : Array.isArray(jsonProduct.images)
            ? jsonProduct.images
            : [];

        jsonProduct.images = parsedImages.map((img) =>
          img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
        );
      } catch (err) {
        console.error(
          `Error parsing product images for product ${jsonProduct.id}:`,
          err.message
        );
        jsonProduct.images = [];
      }

      // Parse and update each variant's images (in variantImages field)
      jsonProduct.variants = (jsonProduct.variants || []).map((variant) => {
        try {
          const parsedVariantImages =
            typeof variant.variantImages === "string"
              ? JSON.parse(variant.variantImages)
              : Array.isArray(variant.variantImages)
              ? variant.variantImages
              : [];

          variant.variantImages = parsedVariantImages.map((img) =>
            img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
          );
        } catch (err) {
          console.error(
            `Error parsing variant images for variant ${variant.id}:`,
            err.message
          );
          variant.variantImages = [];
        }

        return {
          ...variant,
          thumbnail: variant.variantImages[0] || null,
        };
      });

      return {
        ...jsonProduct,
        url: `${baseUrl}/product/${jsonProduct.slug || jsonProduct.id}`,
        thumbnail: jsonProduct.images[0] || null,
        totalReviews,
        averageRating,
      };
    });

    res.status(200).json({
      status: true,
      products,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching new arrival products:", error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
exports.getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const ProductData = await product.findByPk(productId);

    if (!ProductData) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    let relatedProducts = [];

    // 🔍 Step 1: By category
    relatedProducts = await product.findAll({
      where: {
        categoryId: ProductData.categoryId,
        id: { [Op.ne]: productId },
        status: "active",
      },
      include: [
        { model: Variant, as: "variants" },
        { model: review, as: "reviews", attributes: ["id", "rating"] },
      ],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    // 🔄 Step 2: By subCategory
    if (relatedProducts.length === 0 && ProductData.subCategoryId) {
      relatedProducts = await product.findAll({
        where: {
          subCategoryId: ProductData.subCategoryId,
          id: { [Op.ne]: productId },
          status: "active",
        },
        include: [{ model: Variant, as: "variants" }],
        limit: 10,
        order: [["createdAt", "DESC"]],
      });
    }

    // 🔄 Step 3: By mainCategory
    if (relatedProducts.length === 0 && ProductData.mainCategoryId) {
      relatedProducts = await product.findAll({
        where: {
          mainCategoryId: ProductData.mainCategoryId,
          id: { [Op.ne]: productId },
          status: "active",
        },
        include: [{ model: Variant, as: "variants" }],
        limit: 10,
        order: [["createdAt", "DESC"]],
      });
    }

    // 🔃 Format response like getNewArrivalProducts
    const products = relatedProducts.map((prod) => {
      const jsonProduct = prod.toJSON();

      // 📷 Product images
      try {
        const parsedImages =
          typeof jsonProduct.images === "string"
            ? JSON.parse(jsonProduct.images)
            : Array.isArray(jsonProduct.images)
            ? jsonProduct.images
            : [];

        jsonProduct.images = parsedImages.map((img) =>
          img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
        );
      } catch (err) {
        console.error(
          `Error parsing product images for product ${jsonProduct.id}:`,
          err.message
        );
        jsonProduct.images = [];
      }

      // 🎨 Variant images
      jsonProduct.variants = (jsonProduct.variants || []).map((variant) => {
        try {
          const parsedVariantImages =
            typeof variant.variantImages === "string"
              ? JSON.parse(variant.variantImages)
              : Array.isArray(variant.variantImages)
              ? variant.variantImages
              : [];

          variant.variantImages = parsedVariantImages.map((img) =>
            img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`
          );
        } catch (err) {
          console.error(
            `Error parsing variant images for variant ${variant.id}:`,
            err.message
          );
          variant.variantImages = [];
        }

        return {
          ...variant,
          thumbnail: variant.variantImages[0] || null,
        };
      });
      // ⭐ Review calculation
      const totalReviews = jsonProduct.reviews ? jsonProduct.reviews.length : 0;
      const totalRating = (jsonProduct.reviews || []).reduce(
        (sum, r) => sum + (parseFloat(r.rating) || 0),
        0
      );
      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";

      delete jsonProduct.reviews;

      return {
        ...jsonProduct,
        url: `${baseUrl}/product/${jsonProduct.slug || jsonProduct.id}`,
        thumbnail: jsonProduct.images[0] || null,
        totalReviews,
        averageRating,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Related products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Related Product Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

exports.getProductsByIds = async (req, res) => {
  try {
    const { products } = req.body;
    // products = [{ productId: 1, variantId: 2 }, { productId: 5, variantId: 7 }]

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Products array is required" });
    }

    const productIds = products.map((p) => p.productId);
    const variantIds = products.map((p) => p.variantId);

    // Fetch products with variants
    const fetchedProducts = await product.findAll({
      where: { id: { [Op.in]: productIds } },
      include: [
        {
          model: variant,
          as: "variants",
          where: { id: { [Op.in]: variantIds } },
          required: false,
        },
        { model: category, as: "category", attributes: ["id", "name", "slug"] },
        { model: mainCategory, as: "mainCategory", attributes: ["id", "name"] },
        { model: subCategory, as: "subCategory", attributes: ["id", "name"] },
      ],
    });

    // Format response
    const result = fetchedProducts.map((prod) => {
      const prodJSON = prod.toJSON();
      prodJSON.features = safeParse(prodJSON.features, []);
      prodJSON.specifications = safeParse(prodJSON.specifications, {});
      prodJSON.customFields = safeParse(prodJSON.customFields, []);

      // Product images (relative paths)
      const rawImages = safeParse(prodJSON.images, []);
      const images = Array.isArray(rawImages) ? rawImages : [];

      const variants = (prodJSON.variants || []).map((v) => {
        const variantImgs = safeParse(v.variantImages, []);
        return { ...v, images: Array.isArray(variantImgs) ? variantImgs : [] };
      });

      return { ...prodJSON, images, variants };
    });

    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching bulk products:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching products",
    });
  }
};
