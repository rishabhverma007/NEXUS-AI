import { operationsRepository, TaskQueueItem } from "@/repositories/operations-repository";

export class QueueManager {
  static async getQueueMetrics(): Promise<TaskQueueItem[]> {
    return operationsRepository.getQueues();
  }
}
