const db = require("../../../config/config");
const RefundSetting = db.refundSetting;
exports.createRefundSetting = async (req, res) => {
  try {
    const { bank, wallet } = req.body;

    const setting = await RefundSetting.create({ bank, wallet });

    res.status(201).json({ status: true, data: setting });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getAllRefundSettings = async (req, res) => {
  try {
    const settings = await RefundSetting.findAll();
    res.status(200).json({ status: true, data: settings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ✅ Get Refund Setting by ID
exports.getRefundSettingById = async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await RefundSetting.findByPk(id);
    if (!setting)
      return res
        .status(404)
        .json({ success: false, message: "Refund setting not found" });

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Refund Setting
exports.updateRefundSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { bank, wallet } = req.body;

    const setting = await RefundSetting.findByPk(id);
    if (!setting)
      return res
        .status(404)
        .json({ success: false, message: "Refund setting not found" });

    await setting.update({ bank, wallet });

    res.status(200).json({ status: true, data: setting });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ✅ Delete Refund Setting
exports.deleteRefundSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await RefundSetting.findByPk(id);
    if (!setting)
      return res
        .status(404)
        .json({ status: false, message: "Refund setting not found" });

    await setting.destroy();

    res
      .status(200)
      .json({ status: true, message: "Refund setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
