"use client";

import { useInfrastructure } from "@/hooks/use-infrastructure";
import { Cpu, Server, Globe, HardDrive, CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export function InfrastructureHealthView() {
  const { nodes, isLoading } = useInfrastructure();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <Server className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading infrastructure cluster telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Infrastructure Top Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block font-medium">Multi-Region EKS Clusters</span>
          <span className="text-xl font-extrabold text-nexus-accent flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> 2 Regions Active
          </span>
          <span className="text-[10px] text-nexus-400">us-east-1 & eu-west-1</span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block font-medium">Redis L2 Cache Cluster</span>
          <span className="text-xl font-extrabold text-nexus-emerald flex items-center gap-1.5">
            <HardDrive className="h-4 w-4" /> 98.4% Hit Rate
          </span>
          <span className="text-[10px] text-nexus-400">1,420 MB Memory Used</span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block font-medium">Circuit Breaker Status</span>
          <span className="text-xl font-extrabold text-nexus-accent flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> CLOSED (Healthy)
          </span>
          <span className="text-[10px] text-nexus-400">0 Tripped Breakers</span>
        </div>

        <div className="p-4 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-1">
          <span className="text-xs text-nexus-400 block font-medium">P99 Latency Profile</span>
          <span className="text-xl font-extrabold text-nexus-brand-light flex items-center gap-1.5">
            <Activity className="h-4 w-4" /> 145 ms
          </span>
          <span className="text-[10px] text-nexus-400">Target: &lt;300ms</span>
        </div>
      </div>

      {/* Cluster Nodes List */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
            <Server className="h-4 w-4 text-nexus-accent" /> EKS Production Nodes Cluster ({nodes.length} Nodes)
          </h3>
          <span className="text-xs text-nexus-400 font-mono">Autoscaling HPA Target: 75% CPU</span>
        </div>

        <div className="space-y-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-4 rounded-xl bg-nexus-950/70 border border-nexus-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-nexus-border transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-nexus-emerald text-[10px] font-bold border border-nexus-emerald/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {node.status.toUpperCase()}
                  </span>
                  <h4 className="font-mono font-bold text-nexus-50">{node.nodeName}</h4>
                </div>
                <div className="text-[11px] text-nexus-400">
                  Region: {node.region} ({node.zone}) | Active Connections: <strong className="text-nexus-accent">{node.activeConnections}</strong>
                </div>
              </div>

              {/* Resource Bars */}
              <div className="flex items-center gap-6">
                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-nexus-400">CPU Load</span>
                    <span className="text-nexus-accent font-mono">{node.cpuUtilizationPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-nexus-850 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${node.cpuUtilizationPercent}%` }} />
                  </div>
                </div>

                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-nexus-400">RAM Load</span>
                    <span className="text-nexus-brand-light font-mono">{node.memoryUtilizationPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-nexus-850 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${node.memoryUtilizationPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
