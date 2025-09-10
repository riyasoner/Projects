const db = require("../../../config/config");

const Blog = db.blog;

// ================= CREATE BLOG =================
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      excerpt,
      categoryId,
      createdBy,
      productId,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      status,
    } = req.body;

    // Required fields
    if (!title || !slug || !description || !createdBy) {
      return res.status(400).json({
        status: false,
        message: "Title, slug, description and createdBy are required",
      });
    }

    // Slug uniqueness
    const existing = await Blog.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(400)
        .json({ status: false, message: "Slug already exists" });
    }

    // Handle images
    const images = req.files
      ? req.files.map((file) => `/blogImages/${file.filename}`)
      : [];

    // Create blog
    const blog = await Blog.create({
      title,
      slug,
      description,
      excerpt,
      images,
      categoryId,
      createdBy,
      productId,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      status,
    });

    // Full image URLs
    const blogWithFullImages = {
      ...blog.toJSON(),
      images: images.map((img) => `${img}`),
    };

    return res.status(201).json({
      status: true,
      message: "Blog created successfully",
      data: blogWithFullImages,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ================= GET ALL BLOGS =================
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.createdBy) {
      where.createdBy = req.query.createdBy;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }

    const { count, rows } = await Blog.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const blogsWithFullImages = rows.map((b) => {
      let images = [];
      if (b.images) {
        try {
          // parse if JSON string
          images =
            typeof b.images === "string" ? JSON.parse(b.images) : b.images;
        } catch (err) {
          images = [];
        }
        images = images.map(
          (img) => `${req.protocol}://${req.get("host")}${img}`
        );
      }

      return { ...b.toJSON(), images };
    });

    return res.status(200).json({
      status: true,
      data: blogsWithFullImages,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ================= GET SINGLE BLOG =================
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    let images = [];
    if (blog.images) {
      try {
        // Agar images string me stored hai to parse karo
        images =
          typeof blog.images === "string"
            ? JSON.parse(blog.images)
            : blog.images;

        // Full URL add karo
        images = images.map(
          (img) => `${req.protocol}://${req.get("host")}${img}`
        );
      } catch (err) {
        images = [];
      }
    }

    return res
      .status(200)
      .json({ status: true, data: { ...blog.toJSON(), images } });
  } catch (error) {
    console.error("Get Blog Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ================= UPDATE BLOG =================
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // Existing images safe parse
    let images = [];
    if (blog.images) {
      try {
        images =
          typeof blog.images === "string"
            ? JSON.parse(blog.images)
            : blog.images;
      } catch (err) {
        images = [];
      }
    }

    // New uploaded images
    if (req.files && req.files.length > 0) {
      // Replace existing images with new uploaded images
      images = req.files.map((file) => `/blogImages/${file.filename}`);
    }
    // Agar req.files nahi hai, existing images retained rahenge

    // Update blog
    await blog.update({ ...req.body, images });

    // Response with relative paths
    const blogWithImages = {
      ...blog.toJSON(),
      images,
    };

    return res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: blogWithImages,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ================= DELETE BLOG =================
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    await blog.destroy();
    return res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
