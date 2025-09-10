const db = require("../../../config/config"); // Adjust the path to your config file
const Contact = db.contact;

// Create a new contact
const createContact = async (req, res) => {
  try {
    const { name, surname, phone_no, email_id, company, job_title, userId } =
      req.body;

    const newContact = await Contact.create({
      name,
      surname,
      phone_no,
      email_id,
      company,
      job_title,
      userId,
    });

    if (req.file) {
      const filePath = req.file
        ? `contact_image/${req.file.filename}`
        : "/src/uploads/contact_image/default.png";
      newContact.contact_image = filePath;
      await newContact.save();
    }

    if (!newContact) {
      return res.status(201).json({
        status: false,
        message: "Contact not created",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error in createContact API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const { userId } = req.query;

    const contacts = await Contact.findAll({
      where: userId ? { userId } : {}, // Apply filter only if userId is provided
    });

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No contacts found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get a contact by ID
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update a contact by ID
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Contact.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({
        status: false,
        message: "Contact not found or no changes made",
      });
    }

    const updatedContact = await Contact.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete a contact by ID
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
