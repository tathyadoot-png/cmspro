"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

export default function NotificationsPage() {

  
  const [notifications, setNotifications] = useState<any[]>([]);

  

  const { hasUnread, setHasUnread } = useNotification();
  const router = useRouter();
  
  useEffect(() => {
    fetch("http://localhost:5000/api/notifications", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setNotifications(data.data));
  }, []);

useEffect(() => {
  const markAllRead = async () => {
    await api.patch("/notifications/mark-all-read");

    setHasUnread(false); // 🔥 THIS FIX
  };

  markAllRead();
}, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>Notifications</h1>

      {notifications.map((n) => (
        <div
          key={n._id}

          // 🔥 CLICK REDIRECT (IMPORTANT)
          onClick={() => {
            if (n.data?.taskId) {
              router.push(`/tasks/${n.data.taskId}`);
            }
          }}

          // 🔥 UNREAD HIGHLIGHT
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10,
            cursor: "pointer",
            background: n.isRead ? "white" : "#eef", // ✅ THIS LINE
          }}
        >
          <h3>{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}