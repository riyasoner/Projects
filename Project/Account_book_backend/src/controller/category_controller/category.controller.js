const db = require("../../../config/config"); // Adjust the path to your config file
const Category = db.category;
const User = db.user;
// Create a new category
const createCategory = async (req, res) => {
  try {
    const { category_name, upper_category, monthly_limit, userId } = req.body;

    // Validate inputs
    if (!category_name || !monthly_limit) {
      return res.status(400).json({
        status: false,
        message: "category_name and monthly_limit are required",
        data: [],
      });
    }

    const newCategory = await Category.create({
      category_name,
      upper_category,
      monthly_limit,
      userId,
    });

    if (!newCategory) {
      return res.status(400).json({
        status: false,
        message: "Category not created",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error in createCategory API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { userId } = req.query;

    const whereClause = userId ? { userId } : {};

    const categories = await Category.findAll({
      where: whereClause,
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No categories found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({
        status: false,
        message: "Category not found or no changes made",
      });
    }

    const updatedCategory = await Category.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getadminCategories = async (req, res) => {
  try {
    // Step 1: Get the Superadmin User
    const superAdmin = await User.findOne({
      where: { user_type: "super_admin" },
    });

    if (!superAdmin) {
      return res.status(404).json({
        status: false,
        message: "Superadmin user not found",
        data: [],
      });
    }

    // Step 2: Use the superadmin's ID to fetch categories
    const categories = await Category.findAll({
      where: { userId: superAdmin.id },
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No categories found for Superadmin",
        data: [],
      });
    }

    // Step 3: Return the categories
    return res.status(200).json({
      status: true,
      message: "Superadmin categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error in getSuperadminCategories:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getadminCategories,
};
