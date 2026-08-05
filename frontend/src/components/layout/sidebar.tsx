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
  Zap,
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useShortcuts } from "@/providers/shortcut-provider";
import { cn } from "@/lib/utils";

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
    { label: "Active Sessions", href: "/sessions", icon: Clock },
    { label: "Audit Logs", href: "/audit", icon: Clock },
    { label: "API Keys", href: "/api-keys", icon: KeyRound },
  ];

  const NavLink = ({ item, compact = false }: { item: (typeof navItems)[number]; compact?: boolean }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl text-xs font-medium transition-all duration-200",
          compact ? "px-3 py-2" : "px-3.5 py-2.5",
          isActive
            ? "text-white bg-gradient-to-r from-indigo-500/20 to-violet-500/10 border border-indigo-400/30 shadow-glow-violet"
            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
        )}
      >
        {/* Active indicator bar */}
        <span
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-400 to-cyan-400 transition-all",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
          )}
        />
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200"
          )}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 h-full border-r border-white/8 bg-[#05040f]/85 backdrop-blur-xl flex flex-col justify-between p-4 z-30 overflow-y-auto">
      <div className="space-y-6">
        {/* Workspace Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-glow-violet">
              <div className="h-full w-full bg-[#0a0918] rounded-[14px] flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="absolute -inset-1 rounded-2xl bg-indigo-500/30 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-sm text-white tracking-tight">
                NEXUS AI
                <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-indigo-500/25 to-cyan-500/25 text-indigo-200 border border-indigo-400/30 align-middle">
                  OS
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 truncate max-w-[120px]">{currentWorkspace.name}</p>
            </div>
          </Link>
        </div>

        {/* New Session */}
        <Link
          href="/chat"
          className="shine w-full py-3 px-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-glow-violet transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </Link>

        {/* Core nav */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em] mb-2">
            Core Operating Engine
          </div>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Identity nav */}
        <nav className="space-y-1 pt-3 border-t border-white/8">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em] mb-2">
            Identity & Governance
          </div>
          {identityItems.map((item) => (
            <NavLink key={item.href} item={item} compact />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/8 flex items-center justify-between">
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 flex items-center gap-1.5 text-xs transition-all"
          title="Keyboard Shortcuts (Shift + ?)"
        >
          <Command className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-[11px]">Shortcuts</span>
        </button>

        <Link
          href="/settings"
          className={cn(
            "p-2 rounded-lg transition-all",
            pathname === "/settings"
              ? "text-cyan-300 bg-white/10 border border-cyan-400/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
          title="Enterprise Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
