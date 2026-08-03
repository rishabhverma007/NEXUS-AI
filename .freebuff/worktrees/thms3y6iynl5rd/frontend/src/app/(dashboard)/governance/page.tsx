import { Metadata } from "next";
import { AdminCenterDashboard } from "@/features/governance/dashboard/admin-center-dashboard";

export const metadata: Metadata = {
  title: "Enterprise Admin Center | NEXUS AI OS",
  description: "Enterprise Governance, Security Controls, Compliance Readiness, Multi-step Approvals & Tenant Management Platform.",
};

export default function GovernancePage() {
  return <AdminCenterDashboard />;
}
