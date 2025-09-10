const db = require("../../../config/config");
const Announcement = db.announcement;
// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { message, link, status } = req.body;

    if (!message) {
      return res.status(400).json({
        status: false,
        message: "Message is required",
      });
    }

    const announcement = await Announcement.create({
      message,
      link,
      status: status !== undefined ? status : true,
    });

    res.status(201).json({
      status: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { status } = req.query;

    const condition = {};
    if (status !== undefined) {
      condition.status = status === "true";
    }

    const announcements = await Announcement.findAll({
      where: condition,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      announcements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, link, status } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
      });
    }

    if (message !== undefined) announcement.message = message;
    if (link !== undefined) announcement.link = link;
    if (status !== undefined) announcement.status = status;

    await announcement.save();

    res.status(200).json({
      status: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
      });
    }

    await announcement.destroy();

    res.status(200).json({
      status: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
