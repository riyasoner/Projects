// controllers/contactController.js

const db = require("../../../config/config");

const ContactUs = db.contactUs;

exports.submitContactForm = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email are required." });
    }

    const newMessage = await ContactUs.create({ fullName, email, message });

    res.status(201).json({
      message: "Contact form submitted successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
exports.getAllContacts = async (req, res) => {
  try {
    // Get page and limit from query params with default values
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    // Fetch data with pagination
    const { count, rows } = await ContactUs.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      message: "Contact entries fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
