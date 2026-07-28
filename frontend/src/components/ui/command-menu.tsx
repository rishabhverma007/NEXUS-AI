"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Database,
  Network,
  Search,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";

export function CommandMenu() {
  const { isCommandMenuOpen, setCommandMenuOpen } = useNexusStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isCommandMenuOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
    setCommandMenuOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-[#05070A]/80 backdrop-blur-xl z-50 flex items-start justify-center pt-[15vh] px-4"
        onClick={() => setCommandMenuOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl glass-dialog rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="h-4 w-4 text-nexus-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Search agents, knowledge documents, or graph entities..."
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-none placeholder-slate-500"
            />
            <button
              onClick={() => setCommandMenuOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Quick Navigation
            </div>

            {[
              {
                icon: Bot,
                label: "Agentic RAG Session",
                href: "/chat",
                color: "text-blue-400",
              },
              {
                icon: Database,
                label: "Knowledge Base & Documents",
                href: "/knowledge",
                color: "text-emerald-400",
              },
              {
                icon: Network,
                label: "3D Knowledge Graph Visualizer",
                href: "/graph",
                color: "text-nexus-400",
              },
              {
                icon: Sparkles,
                label: "Visual AI Studio",
                href: "/studio",
                color: "text-pink-400",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className="w-full p-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-xs text-slate-200 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
