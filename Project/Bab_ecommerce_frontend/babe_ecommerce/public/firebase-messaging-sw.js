importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBeG3uIm5gsQveNFyxXklknJRz0sUEqeSM",
  authDomain: "ecommerce-2d0a5.firebaseapp.com",
  projectId: "ecommerce-2d0a5",
  storageBucket: "ecommerce-2d0a5.firebasestorage.app",
  messagingSenderId: "281661141277",
  appId: "1:281661141277:web:a83485a5ec4d695cc7b1f4",
  measurementId: "G-6TW2745328",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message received:",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/image.png",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if (redirectUrl.startsWith("/")) {
              return client.navigate(redirectUrl);
            }
          }
        }
        return clients.openWindow(redirectUrl);
      })
  );
});
