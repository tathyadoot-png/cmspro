importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// ✅ Firebase init (same config as frontend)
firebase.initializeApp({
  apiKey: "AIzaSyBuiwRxvNkOFXCdiky_XAc9oBLtiMIZacQ",
  authDomain: "cms-sociyo.firebaseapp.com",
  projectId: "cms-sociyo",
  storageBucket: "cms-sociyo.firebasestorage.app",
  messagingSenderId: "225805643674",
  appId: "1:225805643674:web:c3e16c344b100c324b5423",
});

const messaging = firebase.messaging();

// 🔥 BACKGROUND HANDLER
messaging.onBackgroundMessage((payload) => {
  console.log("🔥 SW PAYLOAD:", payload);

  const title = payload.data?.title || "Notification";
  const body = payload.data?.body || "";
  const url = payload.data?.url || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    data: { url },
  });
});

// 🔥 CLICK HANDLE
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});