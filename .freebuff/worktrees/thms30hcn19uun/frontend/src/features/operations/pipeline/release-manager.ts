import { operationsRepository, DeploymentReleaseItem } from "@/repositories/operations-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class ReleaseManager {
  static async createRelease(releaseTag: string, env: string, commitSha: string, deployedBy: string): Promise<DeploymentReleaseItem> {
    runtimeEventBus.publish("DEPLOYMENT_STARTED", { releaseTag, env });
    const release = await operationsRepository.createRelease(releaseTag, env, commitSha, deployedBy);
    runtimeEventBus.publish("DEPLOYMENT_COMPLETED", { releaseTag, env });
    return release;
  }
}
