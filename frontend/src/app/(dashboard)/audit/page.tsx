"use client";

import { useEffect, useState } from "react";
import { auditRepository, AuditLogEntry } from "@/repositories/audit-repository";
import { Clock, Filter, Shield, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    auditRepository.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
          <Clock className="h-6 w-6 text-nexus-amber" />
          Enterprise Audit Logging System
        </h1>
        <p className="text-sm text-nexus-400 mt-1">
          Immutable audit trail for user authentication events, workspace mutations, and model configuration changes.
        </p>
      </div>

      <div className="nexus-glass-elevated rounded-2xl border border-nexus-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-nexus-accent" />
            Audit Trail Events ({logs.length})
          </h3>
          <span className="text-[10px] font-mono text-nexus-500">Real-Time Event Stream</span>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-nexus-850/60 border border-nexus-border space-y-2 text-sm hover:border-nexus-border-hover transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-nexus-accent">{log.eventType}</span>
                <span className="text-xs text-nexus-400 font-mono">{log.timestamp}</span>
              </div>
              <div className="text-nexus-300">Actor: <span className="font-semibold text-nexus-50">{log.actor}</span></div>
              <div className="text-xs text-nexus-400 font-mono bg-nexus-950 p-2 rounded border border-nexus-border">
                {JSON.stringify(log.metadata)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
