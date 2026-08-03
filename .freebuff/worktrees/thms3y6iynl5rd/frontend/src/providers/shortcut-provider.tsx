"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNexusStore } from "@/stores/nexus-store";

interface ShortcutContextType {
  isShortcutsModalOpen: boolean;
  setShortcutsModalOpen: (open: boolean) => void;
}

const ShortcutContext = createContext<ShortcutContextType | undefined>(undefined);

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [isShortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const { setCommandMenuOpen, isCommandMenuOpen } = useNexusStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + ? for Shortcuts Modal
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      }
      // Esc closes open modals
      if (e.key === "Escape") {
        setShortcutsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandMenuOpen]);

  return (
    <ShortcutContext.Provider value={{ isShortcutsModalOpen, setShortcutsModalOpen }}>
      {children}
    </ShortcutContext.Provider>
  );
}

export function useShortcuts() {
  const context = useContext(ShortcutContext);
  if (!context) throw new Error("useShortcuts must be used within ShortcutProvider");
  return context;
}
