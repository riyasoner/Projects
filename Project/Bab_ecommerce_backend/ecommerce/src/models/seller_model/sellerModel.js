module.exports = (sequelize, DataTypes) => {
  const sellerProfile = sequelize.define("sellerProfile", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeDescription: {
      type: DataTypes.TEXT,
    },
    gstNumber: {
      type: DataTypes.STRING,
    },
    panNumber: {
      type: DataTypes.STRING,
    },
    businessType: {
      type: DataTypes.ENUM("Individual", "Proprietorship", "Company"),
      defaultValue: "Individual",
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
    },
    bankIFSC: {
      type: DataTypes.STRING,
    },
    pickupAddress: {
      type: DataTypes.TEXT,
    },
    businessDocs: {
      type: DataTypes.JSON, // store array of document URLs
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    requestedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.STRING,
    },
  });

  // Associations

  return sellerProfile;
};
