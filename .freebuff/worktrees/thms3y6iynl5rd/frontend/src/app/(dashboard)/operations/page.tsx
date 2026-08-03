import { Metadata } from "next";
import { OperationsCenterDashboard } from "@/features/operations/dashboard/operations-center-dashboard";

export const metadata: Metadata = {
  title: "Cloud Operations Center | NEXUS AI OS",
  description: "Enterprise Production Hardening, Scalability, Worker Clusters, Task Queues & Cloud Operations Platform.",
};

export default function OperationsPage() {
  return <OperationsCenterDashboard />;
}
