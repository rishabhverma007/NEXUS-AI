"use client";

import { AgentDescriptor } from "../registry/agent-registry";
import { Bot, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentInspectorProps {
  agent: AgentDescriptor | null;
  onClose: () => void;
}

export function AgentInspector({ agent, onClose }: AgentInspectorProps) {
  if (!agent) return null;

  return (
    <aside className="w-80 h-full border-l border-slate-800/80 bg-slate-950/95 glass-panel p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
            Agent Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-900">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Badge variant="cyan" className="uppercase">{agent.role}</Badge>
          <h2 className="text-sm font-bold text-slate-100">{agent.name}</h2>
          <p className="text-slate-300">{agent.description}</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Capabilities & Permissions</span>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="font-mono text-[10px]">{cap}</Badge>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Execution Mode:</span>
            <span className="text-cyan-400 uppercase">Shared AIRuntimeSDK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Completed Tasks:</span>
            <span className="text-emerald-400">{agent.tasksCompleted} Tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
