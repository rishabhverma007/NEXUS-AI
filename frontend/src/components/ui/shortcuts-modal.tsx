"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, X, Keyboard } from "lucide-react";
import { useShortcuts } from "@/providers/shortcut-provider";

export function ShortcutsModal() {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useShortcuts();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: "⌘K", action: "Open Command Palette & Knowledge Search" },
    { key: "Shift + ?", action: "Toggle Keyboard Shortcuts Cheat Sheet" },
    { key: "Alt + 1", action: "Switch to Agentic RAG Mode" },
    { key: "Alt + 2", action: "Switch to GraphRAG Mode" },
    { key: "Alt + 3", action: "Switch to Episodic Memory Mode" },
    { key: "Esc", action: "Close Drawer / Command Menu / Modal" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#05070A]/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={() => setShortcutsModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg glass-dialog rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-nexus-500/20 text-nexus-400">
                <Keyboard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Keyboard Shortcuts
                </h3>
                <p className="text-xs text-slate-500">
                  Cheat sheet for quick navigation
                </p>
              </div>
            </div>
            <button
              onClick={() => setShortcutsModalOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {shortcuts.map((sc) => (
              <div
                key={sc.key}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-sm"
              >
                <span className="text-slate-300">{sc.action}</span>
                <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 font-mono text-xs text-nexus-400 font-semibold">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
