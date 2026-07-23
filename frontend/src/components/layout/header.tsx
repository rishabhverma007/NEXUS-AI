"use client";

import { Bell, Command, Search } from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useNotifications } from "@/providers/notification-provider";

export function Header() {
  const { setCommandMenuOpen } = useNexusStore();
  const { unreadCount, setNotificationDrawerOpen } = useNotifications();

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-nexus-border bg-nexus-950/40 backdrop-blur-xl">
      {/* Left: Breadcrumb / Title area */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-nexus-50">NEXUS AI</span>
        <span className="text-nexus-600">/</span>
        <span className="text-sm text-nexus-400 font-medium">Enterprise Workspace</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search / Command */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-nexus-border bg-nexus-850/60 text-xs text-nexus-400 hover:text-nexus-200 hover:border-nexus-border-hover transition-all duration-200"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-nexus-800 border border-nexus-border text-[10px] font-mono text-nexus-500">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative h-9 w-9 rounded-xl border border-nexus-border bg-nexus-850/60 flex items-center justify-center text-nexus-400 hover:text-nexus-200 hover:border-nexus-border-hover transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-nexus-rose border-2 border-nexus-950 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">{unreadCount}</span>
            </span>
          )}
        </button>

        {/* User Avatar */}
        <button className="h-9 w-9 rounded-xl bg-gradient-to-br from-nexus-brand to-nexus-accent flex items-center justify-center text-xs font-bold text-white shadow-glow-brand">
          NA
        </button>
      </div>
    </header>
  );
}
