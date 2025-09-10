const cryptoHelper = require("../../utils/cryptoHelper");
const { encrypt, decrypt, hashValue } = cryptoHelper;

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["male", "female", "other"],
      allowNull: true,
    },

    // Encrypted Name
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
        if (!encrypted) return null; // safe check
        try {
          return decrypt(encrypted);
        } catch (err) {
          console.error("Name decryption error:", err.message);
          return null; // agar decrypt fail ho jaye
        }
      },
    },

    // Encrypted Phone
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue("phone_no", encrypt(value));
          this.setDataValue("phone_hash", hashValue(value));
        }
      },
      get() {
        const encrypted = this.getDataValue("phone_no");
        if (!encrypted) return null;
        try {
          return decrypt(encrypted);
        } catch (err) {
          // console.error("Phone decryption error:", err.message);
          return null;
        }
      },
    },

    // Encrypted Email
    email_id: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value) {
          this.setDataValue("email_id", encrypt(value));
          this.setDataValue("email_hash", hashValue(value));
        }
      },
      get() {
        const encrypted = this.getDataValue("email_id");
        if (!encrypted) return null;
        try {
          return decrypt(encrypted);
        } catch (err) {
          // console.error("Email decryption error:", err.message);
          return null;
        }
      },
    },

    // Encrypted Show Password
    show_password: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) this.setDataValue("show_password", encrypt(value));
      },
      get() {
        const encrypted = this.getDataValue("show_password");
        if (!encrypted) return null;
        try {
          return decrypt(encrypted);
        } catch (err) {
          // console.error("Show password decryption error:", err.message);
          return null;
        }
      },
    },
    name_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Encrypted Phone
    phone_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Encrypted Email
    email_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Encrypted Show Password

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Rest of your fields
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_status: {
      type: DataTypes.ENUM,
      values: ["Online", "Offline"],
      allowNull: true,
    },
    new_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirm_new_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otp_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    is_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["verified", "rejected", "suspended"],
      allowNull: true,
      defaultValue: "verified",
    },
    notification: {
      type: DataTypes.BOOLEAN,
    },
    device_id: {
      type: DataTypes.STRING,
    },
    login_from: {
      type: DataTypes.STRING,
    },
    device_token: {
      type: DataTypes.STRING,
    },
    follow_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remember_token: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken_Expiration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_type: {
      type: DataTypes.ENUM,
      values: ["user", "admin", "super_admin"],
      allowNull: true,
      defaultValue: "user",
    },
    createrBySuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdByUserId: {
      type: DataTypes.BIGINT,
    },
  });

  return user;
};
