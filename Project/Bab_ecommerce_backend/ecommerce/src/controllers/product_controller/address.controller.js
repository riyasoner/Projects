const db = require("../../../config/config");
const address = db.address;
const user = db.user;
//  Add or Update Address
exports.addAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country = "India",
      type = "home",
      isDefault = false,
    } = req.body;

    // ✅ Check if user exists
    const userExists = await user.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // ✅ Ensure only one default address per user
    if (isDefault === true) {
      await address.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await address.create({
      userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault,
    });

    return res.status(201).json({
      status: true,
      message: "Address added successfully",
      data: newAddress,
    });

  } catch (err) {
    console.error("Error adding address:", err.message);
    return res.status(500).json({ status: false, message: "Server error while adding address" });
  }
};
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault,
    } = req.body;

    const existing = await address.findByPk(id);

    if (!existing) {
      return res.status(404).json({ status: false, message: "Address not found" });
    }

    // ✅ Ensure only one default address per user
    if (isDefault) {
      await address.update({ isDefault: false }, { where: { userId: existing.userId } });
    }

    await existing.update({
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault,
    });

    return res.status(200).json({
      status: true,
      message: "Address updated successfully",
      data: existing,
    });
  } catch (err) {
    console.error("Error updating address:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Get All Addresses by User
exports.getAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await address.findAll({
      where: { userId },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });

    return res.status(200).json({ status: true, data: addresses });
  } catch (err) {
    console.error("Error fetching addresses:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await address.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Address not found" });
    }

    return res.status(200).json({ status: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error("Error deleting address:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
