import { Metadata } from "next";
import { AIStudioDashboard } from "@/features/studio/dashboard/ai-studio-dashboard";

export const metadata: Metadata = {
  title: "Enterprise AI Studio | NEXUS AI OS",
  description: "Low-code visual workflow builder, prompt studio, agent designer & deployment center for NEXUS AI OS.",
};

export default function StudioPage() {
  return <AIStudioDashboard />;
}
