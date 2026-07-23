import { Bot, Database, Network, ShieldCheck } from "lucide-react";
import { QuickActionsGrid } from "@/features/dashboard/quick-actions";
import { RecentActivityTable } from "@/features/dashboard/recent-activity";

export default function DashboardOverviewPage() {
  const metrics = [
    { title: "Active Knowledge Workspaces", value: "1 Enterprise Workspace", icon: Database, color: "text-nexus-accent" },
    { title: "GraphRAG Topology Nodes", value: "4 Entities / 3 Relations", icon: Network, color: "text-nexus-brand-light" },
    { title: "Multi-Agent Pipelines", value: "6 Specialized Agents", icon: Bot, color: "text-nexus-accent" },
    { title: "Reflection Factual Score", value: "96.4% Verified Accuracy", icon: ShieldCheck, color: "text-nexus-emerald" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold text-nexus-50 tracking-tight">
          NEXUS AI Enterprise Dashboard
        </h1>
        <p className="text-sm text-nexus-400 mt-1">
          Welcome back, Principal Architect. Overview of active multi-agent RAG pipelines and vector store telemetry.
        </p>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-3 hover:border-nexus-border-hover transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-nexus-400 font-medium">{m.title}</span>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div className="text-base font-bold text-nexus-50 font-mono">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-nexus-200">Quick Launch Actions</h2>
        <QuickActionsGrid />
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  );
}
