const cryptoHelper = require("../../utils/cryptoHelper");
const { encrypt, decrypt, hashValue } = cryptoHelper;

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "account",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      // Encrypted Name
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue("name", encrypt(value));
            this.setDataValue("name_hash", hashValue(value));
          }
        },
        get() {
          const encrypted = this.getDataValue("name");
          if (!encrypted) return null; // agar null ho to safe return
          try {
            return decrypt(encrypted);
          } catch (err) {
            // console.error("Name decryption error:", err.message);
            return null; // agar decrypt fail ho jaye to null return
          }
        },
      },

      // Hash for searching
      name_hash: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Encrypted Description
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          if (value) this.setDataValue("description", encrypt(value));
        },
        get() {
          const encrypted = this.getDataValue("description");
          if (!encrypted) return null; // agar null ho to safe return
          try {
            return decrypt(encrypted);
          } catch (err) {
            // console.error("Description decryption error:", err.message);
            return null; // agar decrypt fail ho jaye to null return
          }
        },
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
      starting_balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_archive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "accounts",
    }
  );

  return Account;
};
