"use client";

import { useCompliance } from "@/hooks/use-compliance";
import { ShieldCheck, CheckCircle2, FileText, Download } from "lucide-react";

export function ComplianceDashboard() {
  const { reports, isLoading } = useCompliance();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading compliance frameworks...</span>
      </div>
    );
  }

  const getFrameworkName = (fw: string) => {
    switch (fw) {
      case "soc2_type2":
        return "SOC 2 Type II Readiness";
      case "iso_27001":
        return "ISO / IEC 27001 Mapping";
      case "gdpr":
        return "GDPR Data Protection & Privacy";
      case "hipaa":
        return "HIPAA Security Rule Framework";
      default:
        return fw.toUpperCase();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" /> Enterprise Compliance Readiness Matrix
        </h3>
        <span className="text-xs text-slate-400">Automated Audit-Ready Evidence Controls</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {rep.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{rep.readinessPercent}% Readiness</span>
              </div>

              <h4 className="text-sm font-bold text-slate-100">{getFrameworkName(rep.framework)}</h4>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                <span>Controls Passed:</span>
                <strong className="text-slate-100">{rep.passedControls} / {rep.totalControls} Controls</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Last Audit Export: Today</span>
              <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold text-[11px]">
                <Download className="h-3.5 w-3.5" /> Export Audit Artifact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
