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
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Clock className="h-6 w-6 text-amber-400" />
          Enterprise Audit Logging System
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable audit trail for user authentication events, workspace mutations, and model configuration changes.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            Audit Trail Events ({logs.length})
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Real-Time Event Stream</span>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400">{log.eventType}</span>
                <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>
              <div className="text-slate-300">Actor: <span className="font-semibold text-slate-100">{log.actor}</span></div>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                {JSON.stringify(log.metadata)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
