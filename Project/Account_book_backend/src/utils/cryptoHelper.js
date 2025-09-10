const crypto = require("crypto");
const algorithm = "aes-256-gcm";

// Key setup (already done in your code)
let secretKey = process.env.ENCRYPTION_KEY;
if (!secretKey) {
  throw new Error("ENCRYPTION_KEY is missing!");
}
if (secretKey.length < 64) {
  secretKey = crypto.createHash("sha256").update(secretKey).digest("hex");
}
const keyBuffer = Buffer.from(secretKey, "hex");

// 🔒 Encryption (secure storage)
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

function decrypt(encryptedData) {
  if (!encryptedData) return null;
  const [ivHex, tagHex, data] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    keyBuffer,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// 🔑 Hashing (for search/match)
function hashValue(text) {
  if (!text) return null;
  return crypto.createHash("sha256").update(text).digest("hex");
}

module.exports = { encrypt, decrypt, hashValue };
