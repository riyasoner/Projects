const db = require("../../../config/config");

const FAQ = db.faq;
const Product = db.product;
const Variant = db.variant;
// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, productId, variantId, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        status: false,
        message: "Question and answer are required.",
      });
    }

    const newFAQ = await FAQ.create({
      question,
      answer,
      productId: productId || null,
      variantId: variantId || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: true,
      message: "FAQ created successfully.",
      data: newFAQ,
    });
  } catch (error) {
    console.error("Create FAQ error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//  Get FAQs (with optional filters)
exports.getFAQs = async (req, res) => {
  try {
    const { productId, variantId } = req.query;

    const where = {
      isActive: true,
    };

    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    const faqs = await FAQ.findAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: Variant,
          as: "variant",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      message: "FAQs fetched successfully.",
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQs error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//  Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, productId, variantId, isActive } = req.body;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found.",
      });
    }

    await faq.update({
      question: question ?? faq.question,
      answer: answer ?? faq.answer,
      productId: productId ?? faq.productId,
      variantId: variantId ?? faq.variantId,
      isActive: isActive !== undefined ? isActive : faq.isActive,
    });

    res.status(200).json({
      status: true,
      message: "FAQ updated successfully.",
      data: faq,
    });
  } catch (error) {
    console.error("Update FAQ error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ❌ Delete FAQ (soft delete)
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found.",
      });
    }

    await faq.update({ isActive: false });

    res.status(200).json({
      status: true,
      message: "FAQ deactivated successfully.",
    });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// controllers/faq.controller.js

exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await db.faq.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "FAQ fetched successfully.",
      data: faq,
    });
  } catch (error) {
    console.error("Get FAQ by ID error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
