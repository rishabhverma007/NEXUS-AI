"use client";

import { AgentDescriptor } from "../registry/agent-registry";
import { Bot, CheckCircle2, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentGridProps {
  agents: AgentDescriptor[];
  selectedAgent: AgentDescriptor | null;
  onSelectAgent: (agent: AgentDescriptor) => void;
}

export function AgentGrid({ agents, selectedAgent, onSelectAgent }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {agents.map((ag) => {
        const isSelected = selectedAgent?.id === ag.id;
        return (
          <div
            key={ag.id}
            onClick={() => onSelectAgent(ag)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 text-xs ${
              isSelected
                ? "border-cyan-500/60 bg-blue-600/10 shadow-glow"
                : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{ag.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase">{ag.role}</p>
                </div>
              </div>

              <Badge variant={ag.status === "active" ? "emerald" : "secondary"} className="uppercase font-mono text-[10px]">
                {ag.status}
              </Badge>
            </div>

            <p className="text-slate-300 text-xs line-clamp-2">{ag.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
              <span>{ag.capabilities.length} Capabilities</span>
              <span className="text-cyan-400 font-bold">{ag.tasksCompleted} Tasks Completed</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
