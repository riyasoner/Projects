const slugify = require("slugify");
const db = require("../../../config/config");
const category = db.category;
const { Op } = require("sequelize");
const mainCategory = db.mainCategory;
// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, parentId, mainCategoryId, createdBy } = req.body;
    const file = req.file; // Multer will attach the file to req.file

    // Ensure an image file is provided
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    const existing = await category.findOne({ where: { name } });
    if (existing) {
      return res
        .status(400)
        .json({ status: false, message: "Category already exists" });
    }
    const existingCategory = await mainCategory.findOne({
      where: { id: mainCategoryId },
    });

    if (!existingCategory) {
      return res.status(400).json({
        status: false,
        message: "Invalid mainCategoryId. No such mainCategoryId found.",
      });
    }

    const newCategory = await category.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      parentId: parentId || null,
      createdBy,
      mainCategoryId,
      image: `/image/${file.filename}`, // or file.path depending on your storage configuration
    });

    return res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    console.error("Create category error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// Get All Categories (with subcategories)
exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: categories } = await category.findAndCountAll({
      where: {
        parentId: null,
        isActive: true,
      },
      include: [
        {
          model: category,
          as: "subcategories",
          where: { isActive: true },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]], // ✅ fixed typo
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully.",
      data: categories,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred while fetching categories.",
    });
  }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await category.findByPk(id, {
      include: [{ model: category, as: "subcategories" }],
    });

    if (!cat) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    return res.status(200).json({ status: true, data: cat });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const cat = await category.findByPk(req.params.id);
    if (!cat) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    const updatedData = {};

    if (req.body.name) {
      updatedData.name = req.body.name;
      updatedData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    if (req.body.parentId !== undefined) {
      updatedData.parentId = req.body.parentId;
    }

    if (req.body.mainCategoryId !== undefined) {
      updatedData.mainCategoryId = req.body.mainCategoryId;
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

    await cat.update(updatedData);

    return res.status(200).json({
      status: true,
      message: "Category updated",
      data: cat,
    });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await category.findByPk(id);
    if (!cat)
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });

    await cat.destroy();
    return res.status(200).json({ status: true, message: "Category deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        status: false,
        message: "Category ID is required.",
      });
    }

    const subcategories = await category.findAll({
      where: {
        parentId: categoryId,
        isActive: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Subcategories fetched successfully.",
      data: subcategories,
    });
  } catch (error) {
    console.error("Error in getSubcategoriesByCategoryId:", error);
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred while fetching subcategories.",
    });
  }
};
exports.getAllCategoriess = async (req, res) => {
  try {
    const whereClause = {};

    // Apply mainCategoryId filter if provided
    if (req.query.mainCategoryId) {
      whereClause.mainCategoryId = req.query.mainCategoryId;
    }

    const data = await db.category.findAll({
      where: whereClause,
      include: [{ model: db.subCategory, as: "subCategories" }],
    });

    const fullUrl = `${req.protocol}://${req.get("host")}`;

    const updatedData = data.map((cat) => {
      const updatedSubCategories = cat.subCategories.map((subCat) => ({
        ...subCat.toJSON(),
        image: subCat.image ? `${fullUrl}${subCat.image}` : null,
      }));

      return {
        ...cat.toJSON(),
        image: cat.image ? `${fullUrl}${cat.image}` : null,
        subCategories: updatedSubCategories,
      };
    });

    return res.status(200).json({ status: true, data: updatedData });
  } catch (err) {
    console.error("Get categories error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
