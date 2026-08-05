import { Navbar } from "@/components/layout/navbar";
import { LandingFooter } from "@/features/landing/footer";
import { MouseFollowerGlow } from "@/animations/glow";
import { SmoothScrollProvider } from "@/animations/smooth-scroll";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden">
      <MouseFollowerGlow />
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </SmoothScrollProvider>
    </div>
  );
}
