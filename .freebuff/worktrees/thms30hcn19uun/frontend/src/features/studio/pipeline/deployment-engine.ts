import { studioRepository, DeploymentRecordItem } from "@/repositories/studio-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class DeploymentEngine {
  static async deployWorkflow(
    workflowId: string,
    workspaceId: string,
    versionTag: string,
    targetEnvironment: "dev" | "staging" | "production",
    deployedBy: string
  ): Promise<DeploymentRecordItem> {
    const deployment = await studioRepository.createDeployment({
      workflowId,
      workspaceId,
      versionTag,
      targetEnvironment,
      status: "active",
      deployedBy,
    });

    runtimeEventBus.publish("WORKFLOW_DEPLOYED", {
      workflowId,
      versionTag,
      targetEnvironment,
    });

    return deployment;
  }
}
