"use client";

import { useEffect, useState } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setNotifications(data.data));
  }, []);

  return (
    <div>
      🔔 ({notifications.length})
    </div>
  );
}