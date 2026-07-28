"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  Bot,
  ChevronDown,
  Cpu,
  Network,
  Search,
  Zap,
  Layers,
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useNotifications } from "@/providers/notification-provider";
import { type AgentMode } from "@/types/nexus";

const agentModes: { id: AgentMode; label: string; icon: any }[] = [
  { id: "agentic_rag", label: "Multi-Agent RAG", icon: Bot },
  { id: "graph_rag", label: "GraphRAG Mode", icon: Network },
  { id: "memory_search", label: "Episodic Memory", icon: Layers },
  { id: "deep_research", label: "Deep Reflection", icon: Zap },
];

const models = [
  { id: "gpt-4o", label: "OpenAI GPT-4o Enterprise" },
  { id: "claude-3-5-sonnet", label: "Anthropic Claude 3.5 Sonnet" },
  { id: "deepseek-r1", label: "DeepSeek R1 Reasoning" },
  { id: "ollama-llama3", label: "Ollama Llama-3.3 (Local AI)" },
];

export function Header() {
  const {
    activeMode,
    setActiveMode,
    selectedModel,
    setSelectedModel,
    setCommandMenuOpen,
    isAgentDrawerOpen,
    setAgentDrawerOpen,
  } = useNexusStore();

  const { unreadCount, setNotificationDrawerOpen, isNotificationDrawerOpen } =
    useNotifications();

  return (
    <header className="h-16 border-b border-white/5 glass-nav px-6 flex items-center justify-between z-20">
      {/* Agent Pipeline Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mr-2">
          Mode:
        </span>
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          {agentModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-nexus-500 text-white shadow-lg shadow-nexus-500/25"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 text-xs transition-all hover:border-white/20"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search docs & nodes...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Model Select */}
        <div className="hidden sm:relative sm:block">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-nexus-500/50 cursor-pointer transition-all"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0D1117] text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notifications */}
        <button
          onClick={() => setNotificationDrawerOpen(!isNotificationDrawerOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 relative transition-all hover:border-white/20"
          title="System Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-nexus-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Agent Drawer Toggle */}
        <button
          onClick={() => setAgentDrawerOpen(!isAgentDrawerOpen)}
          className={cn(
            "p-2 rounded-xl border transition-all",
            isAgentDrawerOpen
              ? "bg-nexus-500/20 border-nexus-500/40 text-nexus-400 shadow-sm"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
          )}
          title="Toggle Multi-Agent Execution Drawer"
        >
          <Cpu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
