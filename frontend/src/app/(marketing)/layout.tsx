import { Navbar } from "@/components/layout/navbar";
import { LandingFooter } from "@/features/landing/footer";
import { MouseFollowerGlow } from "@/animations/glow";
import { NexusBackground } from "@/components/ui/background";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-nexus-950 text-nexus-50 flex flex-col relative overflow-hidden">
      <NexusBackground />
      <MouseFollowerGlow />
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <LandingFooter />
    </div>
  );
}
