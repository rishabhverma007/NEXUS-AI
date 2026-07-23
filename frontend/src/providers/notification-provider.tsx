"use client";

import React, { createContext, useContext, useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "agent";
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  isNotificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      title: "System Initialization Complete",
      message: "NEXUS AI Enterprise Core initialized with 5 active themes and pgvector store.",
      type: "success",
      timestamp: "Just now",
      read: false,
    },
    {
      id: "notif_2",
      title: "Reflection Engine Enforced",
      message: "Factual accuracy threshold set to 0.85.",
      type: "agent",
      timestamp: "10 mins ago",
      read: false,
    },
  ]);

  const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const addNotification = (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearAll,
        isNotificationDrawerOpen,
        setNotificationDrawerOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
