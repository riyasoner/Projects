const db = require("../../../config/config");
const ShippingFee = db.shippingFee;

// ✅ Create new shipping rule
exports.createShippingFee = async (req, res) => {
  try {
    const {
      shippingType,
      flatRate,
      freeAboveAmount,
      weightRatePerKg,
      city,
      locationFee,
      isActive,
    } = req.body;

    // Basic validation
    if (!shippingType) {
      return res.status(400).json({
        message: "shippingType is required",
        status: false,
      });
    }

    const validTypes = [
      "flat_rate",
      "free_above",
      "location_based",
      "weight_based",
    ];
    if (!validTypes.includes(shippingType)) {
      return res.status(400).json({
        message: "Invalid shippingType",
        status: false,
      });
    }

    // Validate based on shippingType
    if (
      shippingType === "flat_rate" &&
      (flatRate === undefined || flatRate === null)
    ) {
      return res.status(400).json({
        message: "flatRate is required for flat_rate type",
        status: false,
      });
    }

    if (
      shippingType === "free_above" &&
      (freeAboveAmount === undefined || freeAboveAmount === null)
    ) {
      return res.status(400).json({
        message: "freeAboveAmount is required for free_above type",
        status: false,
      });
    }

    if (
      shippingType === "weight_based" &&
      (weightRatePerKg === undefined || weightRatePerKg === null)
    ) {
      return res.status(400).json({
        message: "weightRatePerKg is required for weight_based type",
        status: false,
      });
    }

    if (shippingType === "location_based") {
      if (!city) {
        return res.status(400).json({
          message: "city is required for location_based type",
          status: false,
        });
      }
      if (locationFee === undefined || locationFee === null) {
        return res.status(400).json({
          message: "locationFee is required for location_based type",
          status: false,
        });
      }
    }

    const fee = await ShippingFee.create({
      shippingType,
      flatRate,
      freeAboveAmount,
      weightRatePerKg,
      city,
      locationFee,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      message: "Shipping rule created",
      data: fee,
      status: true,
    });
  } catch (error) {
    console.error("Create Shipping Fee Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};
// ✅ Get all shipping rules
exports.getAllShippingFees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ShippingFee.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Shipping rules fetched",
      data: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
      status: true,
    });
  } catch (error) {
    console.error("Get Shipping Fees Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

// ✅ Update shipping rule
exports.updateShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await ShippingFee.findByPk(id);

    if (!fee) {
      return res
        .status(404)
        .json({ message: "Shipping rule not found", status: false });
    }

    const {
      shippingType,
      flatRate,
      freeAboveAmount,
      weightRatePerKg,
      city,
      locationFee,
      isActive,
    } = req.body;

    // Validation for shippingType
    if (shippingType) {
      const validTypes = [
        "flat_rate",
        "free_above",
        "location_based",
        "weight_based",
      ];
      if (!validTypes.includes(shippingType)) {
        return res
          .status(400)
          .json({ message: "Invalid shippingType", status: false });
      }

      // Field-specific validation based on shippingType
      if (
        shippingType === "flat_rate" &&
        (flatRate === undefined || flatRate === null)
      ) {
        return res.status(400).json({
          message: "flatRate is required for flat_rate type",
          status: false,
        });
      }

      if (
        shippingType === "free_above" &&
        (freeAboveAmount === undefined || freeAboveAmount === null)
      ) {
        return res.status(400).json({
          message: "freeAboveAmount is required for free_above type",
          status: false,
        });
      }

      if (
        shippingType === "weight_based" &&
        (weightRatePerKg === undefined || weightRatePerKg === null)
      ) {
        return res.status(400).json({
          message: "weightRatePerKg is required for weight_based type",
          status: false,
        });
      }

      if (shippingType === "location_based") {
        if (!city) {
          return res.status(400).json({
            message: "city is required for location_based type",
            status: false,
          });
        }
        if (locationFee === undefined || locationFee === null) {
          return res.status(400).json({
            message: "locationFee is required for location_based type",
            status: false,
          });
        }
      }
    }

    // Proceed to update
    await fee.update(req.body);

    return res.status(200).json({
      message: "Shipping rule updated",
      data: fee,
      status: true,
    });
  } catch (error) {
    console.error("Update Shipping Fee Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};
// ✅ Delete shipping rule
exports.deleteShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await ShippingFee.findByPk(id);

    if (!fee) {
      return res
        .status(404)
        .json({ message: "Shipping rule not found", status: false });
    }

    await fee.destroy();
    return res.status(200).json({
      message: "Shipping rule deleted",
      status: true,
    });
  } catch (error) {
    console.error("Delete Shipping Fee Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

exports.getShippingFeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await ShippingFee.findByPk(id);

    if (!fee) {
      return res.status(404).json({
        message: "Shipping rule not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Shipping rule fetched",
      data: fee,
      status: true,
    });
  } catch (error) {
    console.error("Get Shipping Fee By ID Error:", error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};
