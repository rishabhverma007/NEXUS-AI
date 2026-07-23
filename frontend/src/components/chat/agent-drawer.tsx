"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  Cpu, 
  Database, 
  GitFork, 
  Layers, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  X 
} from "lucide-react";
import { AgentStep } from "@/types/nexus";
import { useNexusStore } from "@/stores/nexus-store";

interface AgentDrawerProps {
  steps: AgentStep[];
  reflectionScore?: number;
}

export function AgentDrawer({ steps, reflectionScore }: AgentDrawerProps) {
  const { isAgentDrawerOpen, setAgentDrawerOpen } = useNexusStore();

  if (!isAgentDrawerOpen) return null;

  const agentIcons: Record<string, any> = {
    RouterAgent: Bot,
    VectorRAGAgent: Database,
    GraphRAGAgent: GitFork,
    MemoryAgent: Layers,
    ReflectionAgent: ShieldCheck,
    SynthesisAgent: Sparkles,
  };

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/80 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto nexus-glass z-20">
      <div className="space-y-4">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-nexus-border/60">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-nexus-accent animate-pulse" />
            <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
              Multi-Agent Telemetry
            </h3>
          </div>
          <button 
            onClick={() => setAgentDrawerOpen(false)}
            className="text-nexus-400 hover:text-nexus-200 p-1 rounded-lg hover:bg-nexus-850"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Factual Confidence Meter */}
        {reflectionScore !== undefined && (
          <div className="p-3 rounded-xl bg-nexus-850/60 border border-nexus-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-nexus-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-nexus-emerald" />
                Reflection Fact Score
              </span>
              <span className="font-mono text-nexus-emerald font-bold">
                {Math.round(reflectionScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-nexus-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reflectionScore * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-nexus-accent via-nexus-brand-light to-nexus-emerald rounded-full"
              />
            </div>
          </div>
        )}

        {/* Live Step Progression List */}
        <div className="space-y-3 pt-2">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-xs text-nexus-500 space-y-2">
              <Bot className="h-8 w-8 mx-auto text-nexus-600" />
              <p>Ready to execute multi-agent workflow.</p>
            </div>
          ) : (
            steps.map((step, idx) => {
              const Icon = agentIcons[step.agent_name] || Bot;
              const isRunning = step.status === "running";
              const isCompleted = step.status === "completed";

              return (
                <motion.div
                  key={step.step_id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isRunning
                      ? "bg-nexus-950/40 border-nexus-accent/50 shadow-glow"
                      : isCompleted
                      ? "bg-nexus-850/40 border-nexus-border/80"
                      : "bg-nexus-950/40 border-nexus-border opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${isRunning ? "bg-nexus-accent/20 text-nexus-accent" : "bg-nexus-800 text-nexus-300"}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-nexus-200">{step.agent_name}</span>
                    </div>

                    {isRunning && <Loader2 className="h-3.5 w-3.5 text-nexus-accent animate-spin" />}
                    {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-nexus-emerald" />}
                  </div>

                  <p className="text-[11px] text-nexus-400 leading-relaxed font-mono pl-6">
                    {step.thought}
                  </p>

                  {step.output && (
                    <div className="mt-2 pl-6">
                      <pre className="text-[10px] bg-nexus-950 p-2 rounded border border-nexus-border text-nexus-300 overflow-x-auto">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
