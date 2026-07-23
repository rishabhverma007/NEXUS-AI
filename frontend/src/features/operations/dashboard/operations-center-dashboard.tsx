"use client";

import { useState } from "react";
import { InfrastructureHealthView } from "./infrastructure-health-view";
import { QueueMonitorView } from "./queue-monitor-view";
import { WorkerManagerView } from "./worker-manager-view";
import { ReleaseManagerView } from "./release-manager-view";
import { DisasterRecoveryView } from "./disaster-recovery-view";
import { Server, Layers, Cpu, Rocket, HardDrive, ShieldCheck, Activity } from "lucide-react";

export function OperationsCenterDashboard() {
  const [activeTab, setActiveTab] = useState<"infra" | "queues" | "workers" | "releases" | "dr">("infra");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <Server className="h-5 w-5 text-cyan-400" /> Enterprise Operations & Cloud Scalability Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Production hardening, multi-region cluster health, background worker scaling, priority task queues, CI/CD releases & disaster recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> 99.99% Availability SLA
          </span>
        </div>
      </div>

      {/* Main Tabbed Navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("infra")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "infra"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="h-4 w-4" /> Infrastructure Cluster
          </button>

          <button
            onClick={() => setActiveTab("queues")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "queues"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" /> Task Queues & DLQ
          </button>

          <button
            onClick={() => setActiveTab("workers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "workers"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="h-4 w-4" /> Worker Pool
          </button>

          <button
            onClick={() => setActiveTab("releases")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "releases"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Rocket className="h-4 w-4" /> Release Pipelines
          </button>

          <button
            onClick={() => setActiveTab("dr")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "dr"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HardDrive className="h-4 w-4" /> Disaster Recovery
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "infra" && <InfrastructureHealthView />}
        {activeTab === "queues" && <QueueMonitorView />}
        {activeTab === "workers" && <WorkerManagerView />}
        {activeTab === "releases" && <ReleaseManagerView />}
        {activeTab === "dr" && <DisasterRecoveryView />}
      </div>
    </div>
  );
}
