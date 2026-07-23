"use client";

import { useState } from "react";
import { useAgentDesigner } from "@/hooks/use-agent-designer";
import { Sparkles, Bot, Wrench, Brain, Plus, CheckCircle2 } from "lucide-react";

export function AgentDesignerVIew() {
  const { createdAgents, createAgent } = useAgentDesigner();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !description) return;
    createAgent(role, description, ["hybrid_retrieval", "graphrag"], ["web_search", "python_interpreter"]);
    setRole("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Create Custom Agent Form */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Bot className="h-4 w-4 text-nexus-accent" /> Create Custom Low-Code Agent
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-nexus-300 font-medium block mb-1">Agent Role ID</label>
            <input
              type="text"
              required
              placeholder="e.g. data_analyst_agent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-nexus-950 border border-nexus-border text-nexus-50 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-nexus-300 font-medium block mb-1">Role Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Specializes in structured CSV analysis & SQL tool execution."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-nexus-950 border border-nexus-border text-nexus-50 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-nexus-accent hover:bg-nexus-accent text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-glow transition-all"
            >
              <Plus className="h-4 w-4" /> Register Custom Agent
            </button>
          </div>
        </form>
      </div>

      {/* Created Agents List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-nexus-300 uppercase tracking-wider">Registered Custom Agents ({createdAgents.length})</h4>
        {createdAgents.map((ag) => (
          <div key={ag.role} className="p-4 rounded-xl bg-nexus-850/70 border border-nexus-border/80 nexus-glass space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-nexus-accent" />
                <h5 className="font-bold text-nexus-50">{ag.role}</h5>
              </div>
              <span className="px-2 py-0.5 rounded bg-nexus-accent/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30">
                Memory: {ag.memoryType}
              </span>
            </div>

            <p className="text-nexus-300">{ag.description}</p>

            <div className="flex items-center gap-4 text-[11px] font-mono text-nexus-400 pt-2 border-t border-nexus-border/60">
              <span>Capabilities: <strong className="text-nexus-accent">{ag.capabilities.join(", ")}</strong></span>
              <span>Allowed Tools: <strong className="text-nexus-brand-light">{ag.allowedTools.join(", ")}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
