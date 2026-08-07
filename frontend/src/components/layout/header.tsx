"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  ChevronDown,
  Cpu,
  LogOut,
  Network,
  Search,
  User as UserIcon,
  Zap,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useAuthStore } from "@/stores/auth-store";
import { useNotifications } from "@/providers/notification-provider";
import { AgentMode } from "@/types/nexus";
import { cn } from "@/lib/utils";
import { AiStatusBadge } from "./ai-status-badge";

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

  const { unreadCount, setNotificationDrawerOpen, isNotificationDrawerOpen } = useNotifications();

  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/login");
  };

  const initials = (user?.full_name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const agentModes: { id: AgentMode; label: string; icon: LucideIcon }[] = [
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
    <header className="h-16 border-b border-white/8 bg-[#05040f]/70 backdrop-blur-xl px-6 flex items-center justify-between z-20">
      {/* Mode selector */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 hidden xl:inline">
          Mode:
        </span>
        <div className="flex items-center bg-white/4 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          {agentModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow-violet"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/4 border border-white/10 text-slate-400 hover:text-white text-xs transition-all hover:border-indigo-400/30"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search docs & nodes...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[10px] font-mono text-slate-300">
            ⌘K
          </kbd>
        </button>

        <AiStatusBadge modelId={selectedModel} />

        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="appearance-none bg-white/4 border border-white/10 hover:border-indigo-400/30 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-400 cursor-pointer transition-all"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0a0918] text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={() => setNotificationDrawerOpen(!isNotificationDrawerOpen)}
          className="p-2.5 rounded-xl bg-white/4 border border-white/10 text-slate-400 hover:text-white relative transition-all hover:border-indigo-400/30"
          title="System Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAgentDrawerOpen(!isAgentDrawerOpen)}
          className={cn(
            "p-2.5 rounded-xl border transition-all",
            isAgentDrawerOpen
              ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300 shadow-glow-violet"
              : "bg-white/4 border-white/10 text-slate-400 hover:text-white"
          )}
          title="Toggle Multi-Agent Execution Drawer"
        >
          <Cpu className="h-4 w-4" />
        </button>

        {/* Account menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl bg-white/4 border border-white/10 hover:border-indigo-400/30 text-slate-400 hover:text-white transition-all"
            title="Account"
            aria-expanded={userMenuOpen}
          >
            <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px]">
              <span className="h-full w-full rounded-[7px] bg-[#0a0918] flex items-center justify-center text-[10px] font-bold text-cyan-300">
                {initials}
              </span>
            </span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-[#0a0918]/95 backdrop-blur-xl shadow-card p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2.5 border-b border-white/8">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Account settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
