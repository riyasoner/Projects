const cryptoHelper = require("../../utils/cryptoHelper");
const { encrypt, decrypt, hashValue } = cryptoHelper;

module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define("transaction", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_type: {
      type: DataTypes.ENUM,
      values: [
        "INCOME",
        "SALE",
        "INVENTORY_SALE",
        "EXPENSE",
        "PURCHASE",
        "INVENTORY_PURCHASE",
        "PERSONNEL_EXPENSE",
        "COLLECTION",
        "PAYMENT",
        "TRANSFER",
        "LEND",
        "BORROW",
        "ADD",
        "SUBTRACT",
      ],
      allowNull: false,
    },
    starting_balance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    account_type: {
      type: DataTypes.ENUM,
      values: [
        "None",
        "PAYABLE_RECEIVABLE",
        "BANK",
        "CREDIT_CARD",
        "PRODUCT",
        "PERSONNEL",
        "SAVINGS",
        "CASH",
      ],
      defaultValue: "None",
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Encrypted fields
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue("category_hash", hashValue(value));
          this.setDataValue("category", encrypt(value));
        }
      },
      get() {
        const val = this.getDataValue("category");
        if (!val) return null; // agar null ho to safe return
        try {
          return decrypt(val);
        } catch (err) {
          // console.error("Category decryption error:", err.message);
          return null; // agar decrypt fail ho jaye to null return
        }
      },
    },
    category_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) this.setDataValue("description", encrypt(value));
      },
      get() {
        const val = this.getDataValue("description");
        if (!val) return null; // agar null ho to safe return
        try {
          return decrypt(val);
        } catch (err) {
          // console.error("Description decryption error:", err.message);
          return null; // agar decrypt fail ho jaye to null return
        }
      },
    },
    target_acc_name: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) this.setDataValue("target_acc_name", encrypt(value));
      },
      get() {
        const val = this.getDataValue("target_acc_name");
        if (!val) return null; // agar null ya undefined ho
        try {
          return decrypt(val);
        } catch (err) {
          // console.error("Target account name decryption error:", err.message);
          return null; // decryption fail ho jaye to null return
        }
      },
    },
    source_acc_name: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) this.setDataValue("source_acc_name", encrypt(value));
      },
      get() {
        const val = this.getDataValue("source_acc_name");
        if (!val) return null; // agar null ya undefined ho
        try {
          return decrypt(val);
        } catch (err) {
          // console.error("Source account name decryption error:", err.message);
          return null; // decryption fail ho jaye to null return
        }
      },
    },
    coll_kisht_type: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) this.setDataValue("coll_kisht_type", encrypt(value));
      },
      get() {
        const val = this.getDataValue("coll_kisht_type");
        if (!val) return null; // null ya undefined ke liye safe
        try {
          return decrypt(val);
        } catch (err) {
          // console.error("coll_kisht_type decryption error:", err.message);
          return null; // decryption fail hone par null return
        }
      },
    },

    accountId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emiId: {
      type: DataTypes.BIGINT,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    account_settled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    transaction_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    view_by_superAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    acc_setled_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upload_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    settlement_status: {
      type: DataTypes.ENUM,
      values: ["None", "Pending", "Approved", "Rejected"],
      defaultValue: "None",
      allowNull: true,
    },
    coll_emi_times: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coll_total_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    coll_emiDue_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emi_status: {
      type: DataTypes.ENUM,
      values: ["None", "Unpaid", "Paid"],
      defaultValue: "None",
      allowNull: true,
    },
    collection_status: {
      type: DataTypes.ENUM,
      values: ["None", "Pending", "Completed", "Cancelled"],
      defaultValue: "Pending",
      allowNull: true,
    },
    current_source_acc_available_balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    current_targeted_acc_available_balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  });

  return transaction;
};
