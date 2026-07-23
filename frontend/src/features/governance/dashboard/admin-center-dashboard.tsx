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
import { TabButton } from "@/components/ui/tab-button";

export function AdminCenterDashboard() {
  const [activeTab, setActiveTab] = useState<"org" | "policies" | "security" | "compliance" | "approvals" | "license" | "audit">("org");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 pt-8">
        <div>
          <h1 className="text-xl font-bold text-nexus-50 flex items-center gap-2 tracking-tight">
            <Shield className="h-5 w-5 text-nexus-accent" /> Enterprise Governance & Administration Center
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Centralized governance control plane for enterprise tenant hierarchies, security controls, compliance readiness, multi-stage approvals, and licenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="nexus-badge-emerald flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Enterprise Secured
          </span>
        </div>
      </div>

      {/* Main Tabbed Governance Navigation Bar */}
      <div className="px-8 space-y-4">
        <div className="flex items-center gap-1.5 border-b border-nexus-border pb-2 overflow-x-auto">
          <TabButton active={activeTab === "org"} onClick={() => setActiveTab("org")} icon={Building2} label="Organization Hierarchy" />
          <TabButton active={activeTab === "policies"} onClick={() => setActiveTab("policies")} icon={Sliders} label="Policy Center" />
          <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={ShieldCheck} label="Security Center" />
          <TabButton active={activeTab === "compliance"} onClick={() => setActiveTab("compliance")} icon={FileText} label="Compliance Matrix" />
          <TabButton active={activeTab === "approvals"} onClick={() => setActiveTab("approvals")} icon={Lock} label="Approval Queue" />
          <TabButton active={activeTab === "license"} onClick={() => setActiveTab("license")} icon={Sparkles} label="License & Quotas" />
          <TabButton active={activeTab === "audit"} onClick={() => setActiveTab("audit")} icon={Clock} label="Audit Log Stream" />
        </div>

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


