import { Metadata } from "next";
import { AIStudioDashboard } from "@/features/studio/dashboard/ai-studio-dashboard";

export const metadata: Metadata = {
  title: "Studio Workspace | ZHĪ AI OS",
  description: "Low-code visual workflow builder, prompt studio, agent designer & deployment center for ZHĪ AI OS.",
};

export default function StudioWorkspacePage() {
  return <AIStudioDashboard />;
}
