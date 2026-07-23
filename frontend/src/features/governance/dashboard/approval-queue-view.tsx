"use client";

import { useApprovals } from "@/hooks/use-approvals";
import { CheckCircle2, XCircle, Clock, Lock, Layers } from "lucide-react";

export function ApprovalQueueView() {
  const { approvals, isLoading, grantApproval, rejectApproval } = useApprovals();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-900/60 animate-pulse">
        <Clock className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <span className="text-xs text-slate-400">Loading approval queue...</span>
      </div>
    );
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "approved":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> APPROVED</span>;
      case "rejected":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><XCircle className="h-3 w-3" /> REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse"><Clock className="h-3 w-3" /> PENDING REVIEW</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyan-400" /> Multi-Step Governance Approval Queue ({approvals.length})
        </h3>
        <span className="text-xs text-slate-400">Live Approval Workflows for Tools, Prompts & Research</span>
      </div>

      <div className="space-y-3">
        {approvals.map((appr) => {
          const isPending = appr.status === "pending";

          return (
            <div
              key={appr.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/30">
                    {appr.requestType}
                  </span>
                  {getStatusBadge(appr.status)}
                </div>

                <h4 className="text-xs font-bold text-slate-100">{appr.title}</h4>
                <p className="text-slate-300">Requester: <strong className="text-slate-200">{appr.requesterId}</strong> | Reason: {appr.reason || "N/A"}</p>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => grantApproval(appr.id, "Approved by Enterprise Administrator.")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => rejectApproval(appr.id, "Rejected due to policy non-compliance.")}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
