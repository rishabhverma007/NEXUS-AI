"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCircle2, Info, ShieldAlert, Sparkles, X } from "lucide-react";
import { useNotifications } from "@/providers/notification-provider";

export function NotificationDrawer() {
  const {
    notifications,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  if (!isNotificationDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 sm:w-96 h-full border-l border-slate-800 bg-slate-950/95 glass-panel p-5 flex flex-col justify-between shadow-2xl"
        >
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                  Notification Center
                </h3>
              </div>
              <button
                onClick={() => setNotificationDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button onClick={markAllAsRead} className="hover:text-slate-200 flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-400" /> Mark all read
              </button>
              <button onClick={clearAll} className="hover:text-rose-400">
                Clear all
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      item.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : item.type === "agent"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-100">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
