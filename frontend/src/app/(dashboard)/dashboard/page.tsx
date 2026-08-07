import { QuickActionsGrid } from "@/features/dashboard/quick-actions";
import { DashboardStats } from "@/features/dashboard/dashboard-stats";
import { RecentActivityTable } from "@/features/dashboard/recent-activity";

export default function DashboardOverviewPage() {
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

      {/* Metrics Widgets (live telemetry) */}
      <DashboardStats />

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
