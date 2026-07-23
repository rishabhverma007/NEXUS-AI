"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Bot, Database, Network, BrainCircuit,
  Users, Settings, FileText, Activity, Shield, Wrench,
  Search, Cpu, BookOpen, Key, GitBranch, Layers,
  BarChart3, Terminal, Globe, Sparkles
} from "lucide-react";

const navigation = [
  { section: "Workspace", items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Chat", href: "/chat", icon: Bot },
    { label: "Knowledge", href: "/knowledge", icon: Database },
    { label: "GraphRAG", href: "/graph", icon: Network },
    { label: "Memory", href: "/memory", icon: BrainCircuit },
    { label: "Embedding", href: "/embedding", icon: Cpu },
  ]},
  { section: "Intelligence", items: [
    { label: "Agents", href: "/agents", icon: Bot },
    { label: "Research", href: "/research", icon: Search },
    { label: "Retrieval", href: "/retrieval", icon: Database },
    { label: "Studio", href: "/studio", icon: GitBranch },
  ]},
  { section: "Operations", items: [
    { label: "Observability", href: "/observability", icon: Activity },
    { label: "Governance", href: "/governance", icon: Shield },
    { label: "Tools", href: "/tools", icon: Wrench },
    { label: "API Keys", href: "/api-keys", icon: Key },
    { label: "Operations", href: "/operations", icon: Terminal },
  ]},
  { section: "Settings", items: [
    { label: "Organization", href: "/organization", icon: Globe },
    { label: "Workspace", href: "/workspace", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 h-full border-r border-nexus-border bg-nexus-950/80 backdrop-blur-2xl flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-nexus-border">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-nexus-brand to-nexus-accent p-0.5">
          <div className="h-full w-full bg-nexus-950 rounded-[6px] flex items-center justify-center">
            <BrainCircuit className="h-3.5 w-3.5 text-nexus-accent" />
          </div>
        </div>
        <span className="font-bold text-sm text-nexus-50 tracking-tight">NEXUS AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.section} className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-nexus-500 uppercase tracking-widest">
              {group.section}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-nexus-brand/10 text-nexus-brand-light border border-nexus-brand/20"
                      : "text-nexus-400 hover:text-nexus-200 hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    isActive ? "text-nexus-brand-light" : "text-nexus-500 group-hover:text-nexus-400"
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-nexus-brand shadow-glow-brand" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-nexus-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-nexus-400 text-[10px]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-emerald" />
          </div>
          <span className="font-mono font-semibold text-nexus-500">v2.0 Enterprise</span>
        </div>
      </div>
    </aside>
  );
}
