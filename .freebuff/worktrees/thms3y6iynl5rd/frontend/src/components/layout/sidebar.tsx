"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Bot,
  Brain,
  Layout,
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
  Zap,
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { useShortcuts } from "@/providers/shortcut-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { currentWorkspace } = useNexusStore();
  const { setShortcutsModalOpen } = useShortcuts();

  const navItems = [
    {
      section: "Core Operating Engine",
      items: [
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
        { label: "Visual AI Studio", href: "/studio", icon: GitFork },
      ],
    },
    {
      section: "Identity & Governance",
      items: [
        { label: "Enterprise Admin", href: "/governance", icon: ShieldCheck },
        { label: "Cloud Operations", href: "/operations", icon: Server },
        { label: "Workspace Members", href: "/workspace", icon: Users },
        { label: "Organization", href: "/organization", icon: Building2 },
        { label: "Active Sessions", href: "/sessions", icon: Clock },
        { label: "Audit Logs", href: "/audit", icon: Clock },
        { label: "API Keys", href: "/api-keys", icon: KeyRound },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full glass-sidebar flex flex-col z-30 overflow-y-auto">
      {/* Workspace Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-nexus-500 via-purple-500 to-cyan-500 p-[2px] shadow-lg shadow-nexus-500/25 flex-shrink-0">
            <div className="h-full w-full bg-[#05070A] rounded-[10px] flex items-center justify-center">
              <Layout className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
              NEXUS
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-nexus-500/20 text-nexus-400 border border-nexus-500/30">
                OS
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              {currentWorkspace.name}
            </p>
          </div>
        </div>
      </div>

      {/* New Session Button */}
      <div className="px-4 pt-3">
        <Link
          href="/chat"
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-nexus-500 via-purple-500 to-cyan-500 hover:from-nexus-600 hover:via-purple-600 hover:to-cyan-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-nexus-500/30 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navItems.map((group) => (
          <nav key={group.section} className="space-y-0.5">
            <div className="px-3 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              {group.section}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-nexus-500/15 text-nexus-400 border border-nexus-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        ))}
      </div>

      {/* Shortcuts & Settings Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1.5 text-xs transition-all"
          title="Keyboard Shortcuts (Shift + ?)"
        >
          <Command className="h-3.5 w-3.5 text-nexus-400" />
          <span className="text-[11px]">Shortcuts</span>
        </button>

        <Link
          href="/settings"
          className={cn(
            "p-1.5 rounded-lg hover:bg-white/5 transition-colors",
            pathname === "/settings"
              ? "text-cyan-400 bg-white/5"
              : "text-slate-400 hover:text-slate-200"
          )}
          title="Enterprise Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
