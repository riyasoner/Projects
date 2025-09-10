// routes/suborder.js
const db = require("../../../config/config");
const SubOrder = db.suborder;

exports.tracking = async (req, res) => {
  const { suborderId } = req.query;
  const { courierName, trackingNumber, trackingUrl } = req.body;

  try {
    const suborder = await SubOrder.findByPk(suborderId);
    if (!suborder) {
      return res
        .status(404)
        .json({ message: "Suborder not found", status: true });
    }

    suborder.courierName = courierName;
    suborder.trackingNumber = trackingNumber;
    suborder.trackingUrl = trackingUrl;
    suborder.orderStatus = "shipped";

    await suborder.save();

    res.json({
      message: "Tracking info saved successfully",
      suborder,
      status: true,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", status: false });
  }
};
