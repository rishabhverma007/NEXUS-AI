import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatusBar } from "@/components/layout/status-bar";
import { NotificationDrawer } from "@/features/dashboard/notification-drawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 flex-col">
      <div className="flex flex-1 h-[calc(100vh-1.75rem)] w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <StatusBar />
      <NotificationDrawer />
    </div>
  );
}
