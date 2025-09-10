const { Op, fn, col, where } = require("sequelize");
const db = require("../../../config/config");
const Product = db.product;
const Variant = db.variant;
const Category = db.category;
const MainCategory = db.mainCategory;
const SubCategory = db.subCategory;
const review = db.review;
// exports.globalSearch = async (req, res) => {
//   try {
//     const { keyword = "", page = 1, limit = 10, sellerId } = req.query;
//     const offset = (parseInt(page) - 1) * parseInt(limit);

//     // Function to build product conditions
//     const buildConditions = async (includeKeyword = true) => {
//       let variantProductIds = [];
//       let categoryIds = [];
//       let subCategoryIds = [];
//       let mainCategoryIds = [];

//       if (includeKeyword && keyword) {
//         // Search in Variants
//         const matchingVariants = await Variant.findAll({
//           where: {
//             [Op.or]: [
//               { variantName: { [Op.like]: `%${keyword}%` } },
//               { sku: { [Op.like]: `%${keyword}%` } },
//             ],
//           },
//           attributes: ["productId"],
//         });
//         variantProductIds = matchingVariants.map((v) => v.productId);

//         // Search in Category
//         const matchedCategories = await Category.findAll({
//           where: { name: { [Op.like]: `%${keyword}%` } },
//           attributes: ["id"],
//         });
//         categoryIds = matchedCategories.map((cat) => cat.id);

//         // Search in SubCategory
//         const matchedSubCategories = await SubCategory.findAll({
//           where: { name: { [Op.like]: `%${keyword}%` } },
//           attributes: ["id"],
//         });
//         subCategoryIds = matchedSubCategories.map((sub) => sub.id);

//         // Search in MainCategory
//         const matchedMainCategories = await MainCategory.findAll({
//           where: { name: { [Op.like]: `%${keyword}%` } },
//           attributes: ["id"],
//         });
//         mainCategoryIds = matchedMainCategories.map((main) => main.id);
//       }

//       const conditions =
//         includeKeyword && keyword
//           ? {
//               [Op.or]: [
//                 { title: { [Op.like]: `%${keyword}%` } },
//                 { brand: { [Op.like]: `%${keyword}%` } },
//                 { description: { [Op.like]: `%${keyword}%` } },
//                 { id: { [Op.in]: variantProductIds } },
//                 { categoryId: { [Op.in]: categoryIds } },
//                 { subCategoryId: { [Op.in]: subCategoryIds } },
//                 { mainCategoryId: { [Op.in]: mainCategoryIds } },
//                 where(
//                   fn(
//                     "JSON_CONTAINS",
//                     col("keywords"),
//                     `"${keyword.toLowerCase()}"`
//                   ),
//                   1
//                 ),
//               ],
//             }
//           : {};

//       if (sellerId) {
//         conditions.sellerId = sellerId;
//       }

//       return conditions;
//     };

//     // First attempt with keyword filters
//     let productConditions = await buildConditions(true);

//     let result = await Product.findAndCountAll({
//       where: productConditions,
//       include: [
//         { model: Variant, as: "variants" },
//         { model: Category, as: "category", required: false },
//         { model: MainCategory, as: "mainCategory", required: false },
//         { model: SubCategory, as: "subCategory", required: false },
//       ],
//       offset,
//       limit: parseInt(limit),
//       distinct: true, // ensures correct count when using include
//     });

//     // Fallback if no keyword match
//     if (result.count === 0 && keyword) {
//       productConditions = await buildConditions(false);

//       result = await Product.findAndCountAll({
//         where: productConditions,
//         include: [
//           { model: Variant, as: "variants" },
//           { model: Category, as: "category", required: false },
//           { model: MainCategory, as: "mainCategory", required: false },
//           { model: SubCategory, as: "subCategory", required: false },
//         ],
//         offset,
//         limit: parseInt(limit),
//         distinct: true,
//       });
//     }

//     return res.status(200).json({
//       message: "Search successful.",
//       data: result.rows,
//       total: result.count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(result.count / limit),
//       status: true,
//     });
//   } catch (error) {
//     console.error("Global search error:", error);
//     return res.status(500).json({
//       message: "Search failed.",
//       error: error.message,
//       status: false,
//     });
//   }
// };

exports.globalSearch = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10, sellerId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Function to build product search conditions
    const buildConditions = async (includeKeyword = true) => {
      let variantProductIds = [];
      let categoryIds = [];
      let subCategoryIds = [];
      let mainCategoryIds = [];

      if (includeKeyword && keyword) {
        // Search in Variants
        const matchingVariants = await Variant.findAll({
          where: {
            [Op.or]: [
              { variantName: { [Op.like]: `%${keyword}%` } },
              { sku: { [Op.like]: `%${keyword}%` } },
            ],
          },
          attributes: ["productId"],
        });
        variantProductIds = matchingVariants.map((v) => v.productId);

        // Search in Category
        const matchedCategories = await Category.findAll({
          where: { name: { [Op.like]: `%${keyword}%` } },
          attributes: ["id"],
        });
        categoryIds = matchedCategories.map((cat) => cat.id);

        // Search in SubCategory
        const matchedSubCategories = await SubCategory.findAll({
          where: { name: { [Op.like]: `%${keyword}%` } },
          attributes: ["id"],
        });
        subCategoryIds = matchedSubCategories.map((sub) => sub.id);

        // Search in MainCategory
        const matchedMainCategories = await MainCategory.findAll({
          where: { name: { [Op.like]: `%${keyword}%` } },
          attributes: ["id"],
        });
        mainCategoryIds = matchedMainCategories.map((main) => main.id);
      }

      const conditions = {};

      if (includeKeyword && keyword) {
        conditions[Op.or] = [
          { title: { [Op.like]: `%${keyword}%` } },
          { brand: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
          { id: { [Op.in]: variantProductIds } },
          { categoryId: { [Op.in]: categoryIds } },
          { subCategoryId: { [Op.in]: subCategoryIds } },
          { mainCategoryId: { [Op.in]: mainCategoryIds } },
          where(
            fn("JSON_CONTAINS", col("keywords"), `"${keyword.toLowerCase()}"`),
            1
          ),
        ];
      }

      if (sellerId) {
        conditions.sellerId = sellerId;
      }

      return conditions;
    };

    // First search attempt
    let productConditions = await buildConditions(true);

    let result = await Product.findAndCountAll({
      where: productConditions,
      include: [
        { model: Variant, as: "variants" },
        { model: Category, as: "category", required: false },
        { model: MainCategory, as: "mainCategory", required: false },
        { model: SubCategory, as: "subCategory", required: false },
        {
          model: review,
          as: "reviews",
          attributes: ["id", "rating"],
        },
      ],
      offset,
      limit: parseInt(limit),
      distinct: true,
    });

    // If no results, try searching without keyword in related tables
    if (result.count === 0 && keyword) {
      productConditions = await buildConditions(false);

      result = await Product.findAndCountAll({
        where: productConditions,
        include: [
          { model: Variant, as: "variants" },
          { model: Category, as: "category", required: false },
          { model: MainCategory, as: "mainCategory", required: false },
          { model: SubCategory, as: "subCategory", required: false },
          {
            model: review,
            as: "reviews",
            attributes: ["id", "rating"],
          },
        ],
        offset,
        limit: parseInt(limit),
        distinct: true,
      });
    }

    // Map variants to include full image URL
    const host = req.get("host");
    const protocol = req.protocol;

    const dataWithUrls = result.rows.map((product) => {
      const variantsWithUrl = product.variants.map((variant) => {
        let images = [];
        if (variant.variantImages) {
          try {
            const parsed = JSON.parse(variant.variantImages); // parse JSON string
            if (Array.isArray(parsed)) {
              images = parsed.map((img) =>
                img ? `${protocol}://${host}${img}` : null
              );
            }
          } catch (err) {
            console.error("Error parsing variantImages:", err);
          }
        }

        return {
          ...variant.toJSON(),
          variantImages: images,
        };
      });
      const reviews = product.reviews || [];
      const avgRating =
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) /
              reviews.length
            ).toFixed(1)
          : "0.0";

      return {
        ...product.toJSON(),
        variants: variantsWithUrl,
        averageRating: avgRating, // yaha add kiya
        totalReviews: reviews.length,
      };
    });

    return res.status(200).json({
      message: "Search successful.",
      data: dataWithUrls,
      total: result.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      status: true,
    });
  } catch (error) {
    console.error("Global search error:", error);
    return res.status(500).json({
      message: "Search failed.",
      error: error.message,
      status: false,
    });
  }
};
