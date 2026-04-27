"use client";

import { useEffect } from "react";
import { initNotifications, listenForegroundNotifications } from "@/lib/notifications";

export default function NotificationInitializer() {

  useEffect(() => {
    initNotifications();                 // 🔥 TOKEN GENERATE + SAVE
    listenForegroundNotifications();     // 🔥 FOREGROUND SHOW
  }, []);

  return null;
}