import { operationsRepository, BackgroundWorkerItem } from "@/repositories/operations-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class WorkerClusterEngine {
  static async listWorkers(): Promise<BackgroundWorkerItem[]> {
    return operationsRepository.getWorkers();
  }

  static async dispatchBackgroundJob(workerType: BackgroundWorkerItem["workerType"], payload: any): Promise<void> {
    runtimeEventBus.publish("WORKER_STARTED", {
      workerType,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}
