const db = require("../../../config/config");
const AdminFeeConfig = db.adminFeeConfig;
// Create
exports.createAdminFeeConfig = async (req, res) => {
  try {
    const data = await AdminFeeConfig.create(req.body);
    return res
      .status(201)
      .json({ status: true, message: "Created successfully", data });
  } catch (error) {
    console.error("Create Error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Failed to create admin fee config",
        error: error.message,
      });
  }
};

// Read All
exports.getAllAdminFeeConfigs = async (req, res) => {
  try {
    const data = await AdminFeeConfig.findAll();
    return res.json({ status: true, data });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Failed to fetch admin fee configs",
        error: error.message,
      });
  }
};

// Read One
exports.getAdminFeeConfigById = async (req, res) => {
  try {
    const config = await AdminFeeConfig.findByPk(req.params.id);
    if (!config) {
      return res
        .status(404)
        .json({ status: false, message: "Admin fee config not found" });
    }
    return res.json({ status: true, data: config });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Failed to fetch admin fee config",
        error: error.message,
      });
  }
};

// Update
exports.updateAdminFeeConfig = async (req, res) => {
  try {
    const config = await AdminFeeConfig.findByPk(req.params.id);
    if (!config) {
      return res
        .status(404)
        .json({ status: false, message: "Admin fee config not found" });
    }

    await config.update(req.body);
    return res.json({
      status: true,
      message: "Updated successfully",
      data: config,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Failed to update admin fee config",
        error: error.message,
      });
  }
};

// Delete
exports.deleteAdminFeeConfig = async (req, res) => {
  try {
    const config = await AdminFeeConfig.findByPk(req.params.id);
    if (!config) {
      return res
        .status(404)
        .json({ status: false, message: "Admin fee config not found" });
    }

    await config.destroy();
    return res.json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Failed to delete admin fee config",
        error: error.message,
      });
  }
};
