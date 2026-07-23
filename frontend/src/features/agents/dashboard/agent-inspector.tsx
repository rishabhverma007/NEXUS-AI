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
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            Agent Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-nexus-850/60 border border-nexus-border space-y-2">
          <Badge variant="cyan" className="uppercase">{agent.role}</Badge>
          <h2 className="text-sm font-bold text-nexus-50">{agent.name}</h2>
          <p className="text-nexus-300">{agent.description}</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-nexus-400 uppercase font-mono block">Capabilities & Permissions</span>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="font-mono text-[10px]">{cap}</Badge>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-nexus-950 border border-nexus-border space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-nexus-400">Execution Mode:</span>
            <span className="text-nexus-accent uppercase">Shared AIRuntimeSDK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Completed Tasks:</span>
            <span className="text-nexus-emerald">{agent.tasksCompleted} Tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
