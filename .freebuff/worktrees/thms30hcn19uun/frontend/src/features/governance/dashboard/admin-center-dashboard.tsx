"use client";

import { useState } from "react";
import { OrganizationManager } from "./organization-manager";
import { PolicyCenterView } from "./policy-center-view";
import { SecurityCenterView } from "./security-center-view";
import { ComplianceDashboard } from "./compliance-dashboard";
import { ApprovalQueueView } from "./approval-queue-view";
import { LicenseQuotaManager } from "./license-quota-manager";
import { AuditCenterView } from "./audit-center-view";
import { Building2, Sliders, ShieldCheck, FileText, Lock, Sparkles, Clock, Shield } from "lucide-react";

export function AdminCenterDashboard() {
  const [activeTab, setActiveTab] = useState<"org" | "policies" | "security" | "compliance" | "approvals" | "license" | "audit">("org");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <Shield className="h-5 w-5 text-cyan-400" /> Enterprise Governance & Administration Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized governance control plane for enterprise tenant hierarchies, security controls, compliance readiness, multi-stage approvals, and licenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Enterprise Secured
          </span>
        </div>
      </div>

      {/* Main Tabbed Governance Navigation Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("org")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "org"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="h-4 w-4" /> Organization Hierarchy
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "policies"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="h-4 w-4" /> Policy Center
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "security"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Security Center
          </button>

          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "compliance"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="h-4 w-4" /> Compliance Matrix
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "approvals"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="h-4 w-4" /> Approval Queue
          </button>

          <button
            onClick={() => setActiveTab("license")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "license"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4" /> License & Quotas
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "audit"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="h-4 w-4" /> Audit Log Stream
          </button>
        </div>

        {/* Active Panel View */}
        {activeTab === "org" && <OrganizationManager />}
        {activeTab === "policies" && <PolicyCenterView />}
        {activeTab === "security" && <SecurityCenterView />}
        {activeTab === "compliance" && <ComplianceDashboard />}
        {activeTab === "approvals" && <ApprovalQueueView />}
        {activeTab === "license" && <LicenseQuotaManager />}
        {activeTab === "audit" && <AuditCenterView />}
      </div>
    </div>
  );
}
