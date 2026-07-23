"use client";

import { useState } from "react";
import { InfrastructureHealthView } from "./infrastructure-health-view";
import { QueueMonitorView } from "./queue-monitor-view";
import { WorkerManagerView } from "./worker-manager-view";
import { ReleaseManagerView } from "./release-manager-view";
import { DisasterRecoveryView } from "./disaster-recovery-view";
import { Server, Layers, Cpu, Rocket, HardDrive, ShieldCheck, Activity } from "lucide-react";
import { TabButton } from "@/components/ui/tab-button";

export function OperationsCenterDashboard() {
  const [activeTab, setActiveTab] = useState<"infra" | "queues" | "workers" | "releases" | "dr">("infra");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 pt-8">
        <div>
          <h1 className="text-xl font-bold text-nexus-50 flex items-center gap-2 tracking-tight">
            <Server className="h-5 w-5 text-nexus-accent" /> Enterprise Operations & Cloud Scalability Center
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Production hardening, multi-region cluster health, background worker scaling, priority task queues, CI/CD releases & disaster recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="nexus-badge-emerald flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> 99.99% Availability SLA
          </span>
        </div>
      </div>

      {/* Main Tabbed Navigation */}
      <div className="px-8 space-y-4">
        <div className="flex items-center gap-1.5 border-b border-nexus-border pb-2 overflow-x-auto">
          <TabButton active={activeTab === "infra"} onClick={() => setActiveTab("infra")} icon={Server} label="Infrastructure Cluster" />
          <TabButton active={activeTab === "queues"} onClick={() => setActiveTab("queues")} icon={Layers} label="Task Queues & DLQ" />
          <TabButton active={activeTab === "workers"} onClick={() => setActiveTab("workers")} icon={Cpu} label="Worker Pool" />
          <TabButton active={activeTab === "releases"} onClick={() => setActiveTab("releases")} icon={Rocket} label="Release Pipelines" />
          <TabButton active={activeTab === "dr"} onClick={() => setActiveTab("dr")} icon={HardDrive} label="Disaster Recovery" />
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


