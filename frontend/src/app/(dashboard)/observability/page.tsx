import { Metadata } from "next";
import { OperationsDashboard } from "@/features/observability/dashboard/operations-dashboard";

export const metadata: Metadata = {
  title: "AI Operations Center | NEXUS AI OS",
  description: "Enterprise AI Evaluation, Distributed Tracing, Guardrails & Cost Analytics Platform.",
};

export default function ObservabilityPage() {
  return <OperationsDashboard />;
}
