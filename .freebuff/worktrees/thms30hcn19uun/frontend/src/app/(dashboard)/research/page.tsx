import { Metadata } from "next";
import { ResearchDashboard } from "@/features/research/dashboard/research-dashboard";

export const metadata: Metadata = {
  title: "Enterprise Deep Research Engine | NEXUS AI OS",
  description: "Autonomous evidence-driven long-running research workflows orchestrating Hybrid Retrieval, GraphRAG, Memory Platform, and Sandboxed Tools.",
};

export default function DeepResearchPage() {
  return <ResearchDashboard />;
}
