"use client";

import { useEffect } from "react";
import { initNotifications } from "@/lib/notifications";

export default function NotificationInitializer() {
  useEffect(() => {
    initNotifications();
  }, []);

  return null;
}