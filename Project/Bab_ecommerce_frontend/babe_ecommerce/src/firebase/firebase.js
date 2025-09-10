import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Cloud Messaging
 * Returns the FCM token if supported and permission granted, else null
 */
export const initMessaging = async () => {
  const supported = await isSupported(); // check if browser supports FCM
  if (!supported) return null;

  const messaging = getMessaging(app);

  // Request notification permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  // Get FCM token
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });
  return token;
};

/**
 * Listen for foreground messages
 * cb => callback function to handle the message payload
 */
export const onForegroundMessage = async (cb) => {
  const supported = await isSupported();
  if (!supported) return; // exit if messaging not supported

  const messaging = getMessaging(app);
  onMessage(messaging, (payload) => cb(payload));
};
