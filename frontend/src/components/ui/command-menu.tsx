"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, Network, Search, X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNexusStore } from "@/stores/nexus-store";

export function CommandMenu() {
  const { isCommandMenuOpen, setCommandMenuOpen } = useNexusStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const navigationItems = [
    { path: "/chat", label: "Agentic RAG Session", icon: Bot, desc: "Multi-agent collaboration with live reflection", color: "text-nexus-brand-light" },
    { path: "/knowledge", label: "Knowledge Base & Documents", icon: Database, desc: "Ingested documents and vector store", color: "text-nexus-emerald" },
    { path: "/graph", label: "3D Knowledge Graph Visualizer", icon: Network, desc: "Interactive graph topology explorer", color: "text-nexus-accent" },
  ];

  const filteredItems = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setActiveIndex(0);
  }, [searchQuery]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setCommandMenuOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredItems[activeIndex]) {
      handleNavigate(filteredItems[activeIndex].path);
    }
  };

  return (
    <AnimatePresence>
      {isCommandMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-nexus-950/80 backdrop-blur-md"
            onClick={() => { setCommandMenuOpen(false); setSearchQuery(""); }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-xl"
          >
            <div className="nexus-glass-elevated rounded-3xl overflow-hidden border border-nexus-border">
              {/* Search Header */}
              <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-nexus-border">
                <Search className="h-4 w-4 text-nexus-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search agents, knowledge documents, or graph entities..."
                  className="w-full bg-transparent text-sm text-nexus-50 focus:outline-none placeholder:text-nexus-500"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-nexus-800 border border-nexus-border text-[10px] font-mono text-nexus-400">
                  <span>ESC</span>
                </kbd>
                <button
                  onClick={() => { setCommandMenuOpen(false); setSearchQuery(""); }}
                  className="text-nexus-400 hover:text-nexus-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                <div className="px-3 py-2 text-[10px] font-semibold text-nexus-500 uppercase tracking-widest">
                  Quick Navigation
                </div>
                {filteredItems.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-nexus-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all duration-150 group",
                          isActive
                            ? "bg-nexus-brand/10 border border-nexus-brand/20"
                            : "hover:bg-white/[0.04] border border-transparent"
                        )}
                      >
                        <div className={cn("p-2 rounded-xl bg-nexus-800/80 border border-nexus-border", item.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-nexus-50 truncate">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-nexus-400 truncate mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <ArrowRight className={cn(
                          "h-4 w-4 text-nexus-500 transition-all",
                          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        )} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


