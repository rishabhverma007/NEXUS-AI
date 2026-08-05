"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, X } from "lucide-react";
import { useShortcuts } from "@/providers/shortcut-provider";

export function ShortcutsModal() {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useShortcuts();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: "⌘ K / Ctrl+K", action: "Open Command Palette & Knowledge Search" },
    { key: "Shift + ?", action: "Toggle Keyboard Shortcuts Cheat Sheet" },
    { key: "Alt + 1", action: "Switch to Agentic RAG Mode" },
    { key: "Alt + 2", action: "Switch to GraphRAG Mode" },
    { key: "Alt + 3", action: "Switch to Episodic Memory Mode" },
    { key: "Esc", action: "Close Drawer / Command Menu / Modal" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Command className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                Keyboard Shortcuts Cheat Sheet
              </h3>
            </div>
            <button onClick={() => setShortcutsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((sc) => (
              <div key={sc.key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{sc.action}</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-cyan-400 font-bold">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
