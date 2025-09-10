module.exports = (sequelize, DataTypes) => {
  const suborder = sequelize.define("suborder", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    subTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Sum of item prices (before discount/shipping)",
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "subTotal + shippingFee - discount",
    },
    paymentMethod: {
      type: DataTypes.ENUM("cod", "online", "wallet", "wallet+online"),
      allowNull: false,
      defaultValue: "cod",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.ENUM(
        "placed",
        "shipped",
        "delivered",
        "cancelled",
        "processing"
      ),
      defaultValue: "placed",
    },
    courierName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Courier company name like Blue Dart, Delhivery, etc.",
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Tracking or AWB number from courier",
    },
    trackingUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Auto-generated tracking link",
    },
  });

  return suborder;
};
