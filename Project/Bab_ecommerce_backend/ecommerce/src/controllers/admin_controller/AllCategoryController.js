const slugify = require("slugify");
const db = require("../../../config/config");
const mainCategory = db.mainCategory;
const subCategory = db.subCategory;
const category = db.category;
const Product = db.product;

exports.createMainCategory = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const file = req.file; // Multer will attach the file to req.file

    // Ensure an image file is provided
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    // Check if a main category with the same name already exists
    const exists = await mainCategory.findOne({ where: { name } });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Main category already exists",
      });
    }

    // Create new main category, storing the image filename (or path)
    const newMain = await mainCategory.create({
      name,
      slug: slugify(name, { lower: true }),
      image: `/image/${file.filename}`, // or file.path depending on your storage configuration
      createdBy,
    });

    res.status(201).json({
      status: true,
      message: "Main category created",
      data: newMain,
    });
  } catch (err) {
    console.error("Create main category error:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, createdBy } = req.body;
    const file = req.file;

    // Check if image is provided
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    // Check if the categoryId exists
    const existingCategory = await category.findOne({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(400).json({
        status: false,
        message: "Invalid categoryId. No such category found.",
      });
    }

    // Check if the subcategory with the same name exists under this category
    const exists = await subCategory.findOne({ where: { name, categoryId } });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Subcategory already exists under this category",
      });
    }

    // Create new subcategory
    const newSub = await subCategory.create({
      name,
      slug: slugify(name, { lower: true }),
      categoryId,
      createdBy,
      image: `/image/${file.filename}`,
    });

    return res.status(201).json({
      status: true,
      message: "Subcategory created",
      data: newSub,
    });
  } catch (err) {
    console.error("Create subcategory error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.getAllMainCategories = async (req, res) => {
  try {
    const data = await db.mainCategory.findAll({
      include: [
        {
          model: db.category,
          as: "categories",
          include: [
            {
              model: db.subCategory,
              as: "subCategories",
            },
          ],
        },
      ],
    });

    const fullUrl = `${req.protocol}://${req.get("host")}`;

    const updatedData = data.map((mainCat) => {
      const updatedCategories = mainCat.categories.map((cat) => {
        const updatedSubCategories = cat.subCategories.map((subCat) => {
          return {
            ...subCat.toJSON(),
            image: subCat.image ? `${fullUrl}${subCat.image}` : null,
          };
        });

        return {
          ...cat.toJSON(),
          image: cat.image ? `${fullUrl}${cat.image}` : null,
          subCategories: updatedSubCategories,
        };
      });

      return {
        ...mainCat.toJSON(),
        image: mainCat.image ? `${fullUrl}${mainCat.image}` : null,
        categories: updatedCategories,
      };
    });

    return res.status(200).json({ status: true, data: updatedData });
  } catch (err) {
    console.error("Get main categories error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.getAllSubCategories = async (req, res) => {
  try {
    const whereClause = {};

    if (req.query.categoryId) {
      whereClause.categoryId = req.query.categoryId;
    }

    const data = await db.subCategory.findAll({ where: whereClause });

    const fullUrl = `${req.protocol}://${req.get("host")}`;

    const updatedData = data.map((subCat) => {
      return {
        ...subCat.toJSON(),
        image: subCat.image ? `${fullUrl}${subCat.image}` : null,
      };
    });

    return res.status(200).json({ status: true, data: updatedData });
  } catch (err) {
    console.error("Get subcategories error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.mainCategory.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Main category not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Main category deleted successfully" });
  } catch (err) {
    console.error("Delete main category error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.subCategory.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Subcategory deleted successfully" });
  } catch (err) {
    console.error("Delete subcategory error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.updateMainCategory = async (req, res) => {
  try {
    const mainCat = await mainCategory.findByPk(req.params.id);
    if (!mainCat) {
      return res.status(404).json({
        status: false,
        message: "Main category not found",
      });
    }

    const updatedData = {};

    if (req.body.name) {
      updatedData.name = req.body.name;
      updatedData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    if (req.body.createdBy !== undefined) {
      updatedData.createdBy = req.body.createdBy;
    }

    if (req.file) {
      updatedData.image = `/image/${req.file.filename}`;
    }

    await mainCat.update(updatedData);

    res.status(200).json({
      status: true,
      message: "Main category updated",
      data: mainCat,
    });
  } catch (err) {
    console.error("Update main category error:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const subCat = await subCategory.findByPk(req.params.id);
    if (!subCat) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    const updatedData = {};

    if (req.body.name) {
      updatedData.name = req.body.name;
      updatedData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    if (req.body.categoryId !== undefined) {
      updatedData.categoryId = req.body.categoryId;
    }

    if (req.body.createdBy !== undefined) {
      updatedData.createdBy = req.body.createdBy;
    }

    if (req.body.isActive !== undefined) {
      updatedData.isActive = req.body.isActive;
    }

    if (req.file) {
      updatedData.image = `/image/${req.file.filename}`;
    }

    await subCat.update(updatedData);

    res.status(200).json({
      status: true,
      message: "Subcategory updated",
      data: subCat,
    });
  } catch (err) {
    console.error("Update subcategory error:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.getTop5MainCategories = async (req, res) => {
  try {
    const { Sequelize } = db;

    const topCategories = await Product.findAll({
      attributes: [
        "mainCategoryId",
        [Sequelize.fn("COUNT", Sequelize.col("product.id")), "productCount"],
      ],
      where: {
        status: "active",
      },
      group: ["mainCategoryId"],
      order: [[Sequelize.literal("productCount"), "DESC"]],
      limit: 5,
      include: [
        {
          model: db.mainCategory,
          as: "mainCategory",
          attributes: ["id", "name", "image"],
        },
      ],
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = topCategories.map((category) => {
      const cat = category.mainCategory;
      return {
        id: cat?.id,
        name: cat?.name,
        image: cat?.image ? `${baseUrl}/${cat.image}` : null,
        productCount: category.dataValues.productCount,
      };
    });

    res.status(200).json({
      status: true,
      message: "Top 5 main categories fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error getting top categories:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
