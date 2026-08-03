import { operationsRepository, ClusterNodeItem } from "@/repositories/operations-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class HealthMonitor {
  static async checkHealth(): Promise<{ nodes: ClusterNodeItem[]; systemStatus: "healthy" | "degraded" | "critical" }> {
    const nodes = await operationsRepository.getClusterNodes();
    const isDegraded = nodes.some((n) => n.status !== "healthy");

    if (isDegraded) {
      runtimeEventBus.publish("SERVICE_DEGRADED", { nodesCount: nodes.length });
    }

    return {
      nodes,
      systemStatus: isDegraded ? "degraded" : "healthy",
    };
  }
}
