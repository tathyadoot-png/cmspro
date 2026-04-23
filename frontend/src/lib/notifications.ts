import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const initNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Permission denied");
      return;
    }

    const token = await getToken(messaging!, {
      vapidKey: "BLHipRh9JZkRQ4JWJx4RzgfZtRH0y-ZXik6ba8JBP5yiagk0ByAAbc9aJu1UT0BvpCOOLrihYu2dI9OA4XMWeZg",
    });

    console.log("FCM TOKEN:", token);

    await fetch("http://localhost:5000/api/users/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    });

  } catch (err) {
    console.error(err);
  }
};