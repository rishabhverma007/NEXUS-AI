"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, X, Keyboard } from "lucide-react";
import { useShortcuts } from "@/providers/shortcut-provider";

export function ShortcutsModal() {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useShortcuts();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: "⌘K / Ctrl+K", action: "Open Command Palette & Knowledge Search" },
    { key: "Shift + ?", action: "Toggle Keyboard Shortcuts Cheat Sheet" },
    { key: "Alt + 1", action: "Switch to Agentic RAG Mode" },
    { key: "Alt + 2", action: "Switch to GraphRAG Mode" },
    { key: "Alt + 3", action: "Switch to Episodic Memory Mode" },
    { key: "Esc", action: "Close Drawer / Command Menu / Modal" },
  ];

  return (
    <AnimatePresence>
      {isShortcutsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-nexus-950/80 backdrop-blur-md"
            onClick={() => setShortcutsModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg"
          >
            <div className="nexus-glass-elevated rounded-3xl border border-nexus-border p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-nexus-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20">
                    <Keyboard className="h-4 w-4 text-nexus-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-nexus-50">
                      Keyboard Shortcuts
                    </h3>
                    <p className="text-[11px] text-nexus-400">
                      Master the NEXUS AI workspace
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShortcutsModalOpen(false)}
                  className="h-8 w-8 rounded-xl bg-nexus-800/60 border border-nexus-border flex items-center justify-center text-nexus-400 hover:text-nexus-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-2">
                {shortcuts.map((sc, idx) => (
                  <motion.div
                    key={sc.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-3.5 rounded-2xl bg-nexus-800/40 border border-nexus-border flex items-center justify-between gap-4"
                  >
                    <span className="text-xs text-nexus-300 font-medium">{sc.action}</span>
                    <kbd className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-nexus-900 border border-nexus-border font-mono text-[11px] text-nexus-accent font-bold tracking-wide">
                      {sc.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-[10px] text-nexus-500 text-center pt-2 border-t border-nexus-border">
                Press <kbd className="px-1.5 py-0.5 rounded bg-nexus-800 border border-nexus-border font-mono">Shift + ?</kbd> to toggle this panel
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
