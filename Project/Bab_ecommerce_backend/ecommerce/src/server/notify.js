// /server/notify.js
const admin = require("./firebaseAdmin");

async function sendToToken(token, notification, data = {}) {
  try {
    const message = {
      token,
      notification,
      data: stringifyData(data),
    };
    const response = await admin.messaging().send(message);
    console.log("Notification sent to single device:", response);
    return response;
  } catch (error) {
    console.error("Error sending to token:", error);
    throw error;
  }
}

async function sendToMany(tokens, notification, data = {}) {
  try {
    const results = [];
    for (const token of tokens) {
      const message = {
        token,
        notification,
        data: stringifyData(data),
      };
      const response = await admin.messaging().send(message);
      results.push(response);
    }
    console.log(`Notification sent to ${results.length} devices`);
    return results;
  } catch (error) {
    console.error("Error sending to many tokens:", error);
    throw error;
  }
}

function stringifyData(data) {
  const result = {};
  for (const key in data) {
    result[key] = String(data[key]);
  }
  return result;
}

module.exports = { sendToToken, sendToMany };
