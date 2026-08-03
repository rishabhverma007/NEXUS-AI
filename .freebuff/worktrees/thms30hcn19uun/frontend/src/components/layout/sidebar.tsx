"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  Brain,
  BrainCircuit, 
  Building2, 
  Clock, 
  Command, 
  Database, 
  GitFork, 
  KeyRound, 
  MessageSquare, 
  Network, 
  Plus, 
  Search,
  Server,
  Settings, 
  ShieldCheck, 
  Sparkles, 
  Users,
  Wrench,
  Zap
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useShortcuts } from "@/providers/shortcut-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { currentWorkspace } = useNexusStore();
  const { setShortcutsModalOpen } = useShortcuts();

  const navItems = [
    { label: "Agentic Chat", href: "/chat", icon: MessageSquare },
    { label: "Knowledge Base", href: "/knowledge", icon: Database },
    { label: "Vector Indexing", href: "/embedding", icon: Zap },
    { label: "Hybrid Search Engine", href: "/retrieval", icon: Search },
    { label: "Long-Term Memory", href: "/memory", icon: Brain },
    { label: "3D Knowledge Graph", href: "/graph", icon: Network },
    { label: "Tool Ecosystem & MCP", href: "/tools", icon: Wrench },
    { label: "Multi-Agent System", href: "/agents", icon: Bot },
    { label: "Deep Research Engine", href: "/research", icon: Sparkles },
    { label: "AI Operations Center", href: "/observability", icon: ShieldCheck },
    { label: "Visual AI Studio", href: "/studio", icon: Sparkles },
  ];

  const identityItems = [
    { label: "Enterprise Admin Center", href: "/governance", icon: ShieldCheck },
    { label: "Cloud Operations Center", href: "/operations", icon: Server },
    { label: "Workspace Members", href: "/workspace", icon: Users },
    { label: "Organization Settings", href: "/organization", icon: Building2 },
    { label: "Active Sessions", href: "/sessions", icon: ShieldCheck },
    { label: "Audit Logs", href: "/audit", icon: Clock },
    { label: "API Keys", href: "/api-keys", icon: KeyRound },
  ];

  return (
    <aside className="w-64 h-full border-r border-slate-800/80 bg-slate-950/90 flex flex-col justify-between p-4 glass-panel z-30 overflow-y-auto">
      <div className="space-y-6">
        {/* Workspace Brand Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
                NEXUS AI
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">OS</span>
              </h1>
              <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{currentWorkspace.name}</p>
            </div>
          </div>
        </div>

        {/* New Session Button */}
        <Link 
          href="/chat"
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-glow transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </Link>

        {/* Core Operating Engine Navigation */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Core Operating Engine
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-glow"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Identity & Workspace Navigation */}
        <nav className="space-y-1 pt-3 border-t border-slate-800/60">
          <div className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Identity & Governance
          </div>
          {identityItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-glow"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Shortcuts & Settings Footer */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-900 flex items-center gap-1.5 text-xs"
          title="Keyboard Shortcuts (Shift + ?)"
        >
          <Command className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[11px]">Shortcuts</span>
        </button>

        <Link
          href="/settings"
          className={`p-1.5 rounded-lg hover:bg-slate-900 transition-colors ${
            pathname === "/settings" ? "text-cyan-400 bg-slate-900" : "text-slate-400 hover:text-slate-200"
          }`}
          title="Enterprise Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
