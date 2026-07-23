"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Sparkles } from "lucide-react";
import { useNotifications } from "@/providers/notification-provider";

export function NotificationDrawer() {
  const {
    notifications,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  return (
    <AnimatePresence>
      {isNotificationDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-nexus-950/60 backdrop-blur-sm"
            onClick={() => setNotificationDrawerOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-80 sm:w-96 h-full border-l border-nexus-border bg-nexus-950/95 nexus-glass p-5 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-nexus-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20">
                  <Bell className="h-4 w-4 text-nexus-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-nexus-50">
                    Notifications
                  </h3>
                  <p className="text-[10px] text-nexus-400">
                    {notifications.filter((n) => !n.read).length} unread
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotificationDrawerOpen(false)}
                className="h-8 w-8 rounded-xl bg-nexus-800/60 border border-nexus-border flex items-center justify-center text-nexus-400 hover:text-nexus-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between py-3 text-[11px]">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-nexus-400 hover:text-nexus-200 transition-colors"
              >
                <Check className="h-3.5 w-3.5 text-nexus-emerald" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={clearAll}
                className="text-nexus-400 hover:text-nexus-rose transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="h-8 w-8 text-nexus-600 mb-3" />
                  <p className="text-sm text-nexus-500">No notifications yet</p>
                  <p className="text-xs text-nexus-600 mt-1">You&apos;re all caught up</p>
                </div>
              ) : (
                notifications.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`p-4 rounded-2xl border text-sm space-y-1.5 transition-all hover:shadow-nexus-sm ${
                      item.type === "success"
                        ? "bg-nexus-emerald/10 border-nexus-emerald/25"
                        : item.type === "agent"
                        ? "bg-nexus-brand/10 border-nexus-brand/20"
                        : "bg-nexus-800/40 border-nexus-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-nexus-50">{item.title}</span>
                      <span className="text-[10px] text-nexus-500 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-nexus-400 leading-relaxed">{item.message}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
