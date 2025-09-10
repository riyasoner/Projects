const admin = require("firebase-admin");
const serviceAccount = require("../../config/ecommerce-2d0a5-firebase-adminsdk-fbsvc-0f404c429a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
