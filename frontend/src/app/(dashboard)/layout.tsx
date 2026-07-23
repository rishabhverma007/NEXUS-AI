import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatusBar } from "@/components/layout/status-bar";
import { NotificationDrawer } from "@/features/dashboard/notification-drawer";
import { PageTransition } from "@/animations/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nexus-950 flex-col">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3), transparent)" }}
        />
      </div>

      <div className="flex flex-1 h-[calc(100vh-1.75rem)] w-full overflow-hidden relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-nexus-950/60 backdrop-blur-sm">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <StatusBar />
      <NotificationDrawer />
    </div>
  );
}
