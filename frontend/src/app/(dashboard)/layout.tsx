import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatusBar } from "@/components/layout/status-bar";
import { NotificationDrawer } from "@/features/dashboard/notification-drawer";
import { RequireAuth } from "@/components/auth/require-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex h-screen w-screen overflow-hidden bg-[#04030c]/95 flex-col">
        <div className="flex flex-1 h-[calc(100vh-1.75rem)] w-full overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Ambient glow for content area */}
            <div className="absolute top-0 right-0 w-[420px] h-[300px] bg-indigo-600/8 rounded-full blur-[130px] pointer-events-none" />
            <Header />
            <main className="flex-1 overflow-y-auto relative">{children}</main>
          </div>
        </div>
        <StatusBar />
        <NotificationDrawer />
      </div>
    </RequireAuth>
  );
}
