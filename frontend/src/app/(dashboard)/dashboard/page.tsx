import { Bot, Database, Network, ShieldCheck } from "lucide-react";
import { QuickActionsGrid } from "@/features/dashboard/quick-actions";
import { RecentActivityTable } from "@/features/dashboard/recent-activity";

export default function DashboardOverviewPage() {
  const metrics = [
    { title: "Active Knowledge Workspaces", value: "1 Enterprise Workspace", icon: Database, color: "text-blue-400" },
    { title: "GraphRAG Topology Nodes", value: "4 Entities / 3 Relations", icon: Network, color: "text-indigo-400" },
    { title: "Multi-Agent Pipelines", value: "6 Specialized Agents", icon: Bot, color: "text-cyan-400" },
    { title: "Reflection Factual Score", value: "96.4% Verified Accuracy", icon: ShieldCheck, color: "text-emerald-400" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          NEXUS AI Enterprise Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Welcome back, Principal Architect. Overview of active multi-agent RAG pipelines and vector store telemetry.
        </p>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{m.title}</span>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div className="text-base font-bold text-slate-100 font-mono">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">Quick Launch Actions</h2>
        <QuickActionsGrid />
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  );
}
