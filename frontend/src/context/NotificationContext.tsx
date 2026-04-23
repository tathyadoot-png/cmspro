"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const [hasUnread, setHasUnread] = useState(false);

  return (
    <NotificationContext.Provider value={{ hasUnread, setHasUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);