"use client";

import Link from "next/link";
import { Bot, Database, Network, Plus, ShieldCheck } from "lucide-react";

export function QuickActionsGrid() {
  const actions = [
    {
      title: "New Agentic RAG Session",
      desc: "Start multi-agent collaboration with live reflection drawer",
      href: "/chat",
      icon: Bot,
      color: "from-blue-600 to-indigo-600",
      iconColor: "text-cyan-400"
    },
    {
      title: "Ingest Document Spec",
      desc: "Upload markdown or PDF docs into pgvector vector store",
      href: "/knowledge",
      icon: Database,
      color: "from-cyan-600 to-blue-600",
      iconColor: "text-emerald-400"
    },
    {
      title: "Explore 3D GraphRAG",
      desc: "Interactive 3D WebGL node-edge topology visualizer",
      href: "/graph",
      icon: Network,
      color: "from-indigo-600 to-purple-600",
      iconColor: "text-indigo-400"
    },
    {
      title: "Configure Reflection Engine",
      desc: "Adjust factual accuracy threshold and Top-K retrieval parameters",
      href: "/agents",
      icon: ShieldCheck,
      color: "from-amber-600 to-orange-600",
      iconColor: "text-amber-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link key={act.title} href={act.href}>
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-4 group cursor-pointer h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-800 ${act.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Plus className="h-4 w-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
