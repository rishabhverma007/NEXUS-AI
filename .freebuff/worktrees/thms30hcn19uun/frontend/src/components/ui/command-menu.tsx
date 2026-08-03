"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, Network, Search, X } from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";

export function CommandMenu() {
  const { isCommandMenuOpen, setCommandMenuOpen } = useNexusStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
      if (e.key === "Escape" && isCommandMenuOpen) {
        setCommandMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
    setCommandMenuOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl glass-panel rounded-2xl border border-slate-800 p-4 shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Search className="h-4 w-4 text-cyan-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search agents, knowledge documents, or graph entities..."
              className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
            />
            <button onClick={() => setCommandMenuOpen(false)} className="text-slate-400 hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Quick Navigation
            </div>
            <button
              onClick={() => handleNavigate("/chat")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 text-slate-200 transition-all"
            >
              <Bot className="h-4 w-4 text-blue-400" />
              <span>Agentic RAG Session</span>
            </button>
            <button
              onClick={() => handleNavigate("/knowledge")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 text-slate-200 transition-all"
            >
              <Database className="h-4 w-4 text-emerald-400" />
              <span>Knowledge Base & Documents</span>
            </button>
            <button
              onClick={() => handleNavigate("/graph")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 text-slate-200 transition-all"
            >
              <Network className="h-4 w-4 text-indigo-400" />
              <span>3D Knowledge Graph Visualizer</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
