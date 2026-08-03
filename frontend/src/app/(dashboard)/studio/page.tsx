import { Metadata } from "next";
import { CinematicStudio } from "@/features/studio/cinematic-studio";

export const metadata: Metadata = {
  title: "Visual Low-Code AI Studio | ZHĪ AI OS",
  description: "Cinematic visual workflow builder: compose and orchestrate the six sovereign ZHĪ AI agents.",
};

export default function StudioPage() {
  return <CinematicStudio />;
}
