"use client";

import { useSecurity } from "@/hooks/use-security";
import { Clock, Download, FileText, Shield } from "lucide-react";

export function AuditCenterView() {
  const { events, isLoading } = useSecurity();

  const handleExport = (format: "json" | "csv") => {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-audit-logs-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <Clock className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading audit history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Clock className="h-4 w-4 text-nexus-accent" /> Immutable Platform Audit Logs ({events.length} Events)
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("json")}
            className="px-3 py-1.5 rounded-lg bg-nexus-accent hover:bg-nexus-accent text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-glow"
          >
            <Download className="h-3.5 w-3.5" /> Export Audit (.JSON)
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-3.5 rounded-lg bg-nexus-950/70 border border-nexus-border/80 flex items-center justify-between text-xs hover:border-nexus-border transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-nexus-800 text-[10px] font-mono text-nexus-accent border border-nexus-border">
                  {ev.eventType}
                </span>
                <span className="font-semibold text-nexus-200">{ev.details}</span>
              </div>
              <div className="text-[11px] text-nexus-400">User: {ev.userId || "System"} | IP: {ev.ipAddress || "Internal"}</div>
            </div>
            <span className="text-[10px] text-nexus-400 font-mono">{new Date(ev.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
