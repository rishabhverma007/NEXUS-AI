"use client";

import { useState } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { HardDrive, CheckCircle2, ShieldCheck, Download, Plus, Sparkles } from "lucide-react";

export function DisasterRecoveryView() {
  const [backups, setBackups] = useState([
    {
      id: "bak_01",
      backupType: "pitr",
      sizeBytes: 14820000000,
      storageLocation: "s3://nexus-backups-prod/pitr/2026-07-23",
      status: "verified",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBackup = async () => {
    setIsCreating(true);
    const newBak = await aiRuntime.operations.triggerBackup("snapshot");
    setBackups((prev) => [newBak, ...prev]);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase flex items-center gap-1 w-max">
            <ShieldCheck className="h-3 w-3" /> PITR ACTIVE (365-DAY RETENTION)
          </span>
          <h2 className="text-lg font-bold text-slate-100">Automated Disaster Recovery & Database Snapshots</h2>
          <p className="text-xs text-slate-400">Point-in-Time Recovery enabled across multi-region PostgreSQL read-replicas.</p>
        </div>

        <button
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-glow transition-all shrink-0 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {isCreating ? "Creating Snapshot..." : "Trigger Manual Snapshot"}
        </button>
      </div>

      {/* Backup Snapshots List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Verified Database Snapshots ({backups.length})</h4>
        {backups.map((b) => (
          <div key={b.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30 uppercase">
                  {b.backupType}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="h-3 w-3" /> {b.status.toUpperCase()}
                </span>
              </div>
              <div className="font-mono text-slate-200 text-[11px] truncate">{b.storageLocation}</div>
              <div className="text-[10px] text-slate-400">Size: {(b.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB | {new Date(b.createdAt).toLocaleString()}</div>
            </div>

            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 shrink-0">
              <Download className="h-3.5 w-3.5" /> Validate & Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
