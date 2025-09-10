// utils/encryption.js
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

if (!SECRET_KEY) {
  throw new Error(
    "REACT_APP_ENCRYPTION_KEY is not defined in environment variables"
  );
}

export const encryptId = (id) => {
  try {
    const cipher = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // URL-safe: replace + / = with - _ ~
    return cipher.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "~");
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
};

export const decryptId = (cipher) => {
  try {
    if (!cipher) return null;
    // reverse URL-safe replacements
    const restored = cipher
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/~/g, "=");
    const bytes = CryptoJS.AES.decrypt(restored, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};
