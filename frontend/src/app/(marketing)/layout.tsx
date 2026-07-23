import { Navbar } from "@/components/layout/navbar";
import { LandingFooter } from "@/features/landing/footer";
import { MouseFollowerGlow } from "@/animations/glow";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-hidden">
      <MouseFollowerGlow />
      <Navbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
