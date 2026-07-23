"use client";

import { 
  Bell, 
  Bot, 
  ChevronDown, 
  Cpu, 
  Network, 
  Search, 
  Zap,
  Layers 
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useNotifications } from "@/providers/notification-provider";
import { AgentMode } from "@/types/nexus";

export function Header() {
  const { 
    activeMode, 
    setActiveMode, 
    selectedModel, 
    setSelectedModel, 
    setCommandMenuOpen,
    isAgentDrawerOpen,
    setAgentDrawerOpen 
  } = useNexusStore();

  const { unreadCount, setNotificationDrawerOpen, isNotificationDrawerOpen } = useNotifications();

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

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Agent Pipeline Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-2">Mode:</span>
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {agentModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selector, Search, Notifications & Agent Drawer Toggle */}
      <div className="flex items-center gap-4">
        {/* Cmd+K Quick Launcher */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all hover:border-slate-700"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span>Search docs & nodes...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* LLM Model Provider Dropdown */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="appearance-none bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notifications Drawer Toggle */}
        <button
          onClick={() => setNotificationDrawerOpen(!isNotificationDrawerOpen)}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 relative"
          title="System Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Agent Workflow Drawer Toggle */}
        <button
          onClick={() => setAgentDrawerOpen(!isAgentDrawerOpen)}
          className={`p-2 rounded-xl border transition-all ${
            isAgentDrawerOpen
              ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-glow"
              : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="Toggle Multi-Agent Execution Drawer"
        >
          <Cpu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
