import { observabilityRepository, PromptVersion } from "@/repositories/observability-repository";

export interface PromptExperiment {
  id: string;
  experimentName: string;
  variantA: PromptVersion;
  variantB: PromptVersion;
  trafficSplitPercent: number;
  winner?: "variantA" | "variantB";
}

export class PromptRegistry {
  static async listVersions(workspaceId: string): Promise<PromptVersion[]> {
    return observabilityRepository.getPrompts(workspaceId);
  }

  static async createVersion(
    workspaceId: string,
    promptName: string,
    systemPrompt: string,
    userTemplate: string,
    authorId: string
  ): Promise<PromptVersion> {
    const existing = await observabilityRepository.getPrompts(workspaceId);
    const sameNameVersions = existing.filter((p) => p.promptName === promptName);
    const newVersionNumber = sameNameVersions.length + 1;

    // Deactivate previous active version
    sameNameVersions.forEach((p) => (p.isActive = false));

    return observabilityRepository.createPromptVersion({
      workspaceId,
      promptName,
      versionNumber: newVersionNumber,
      systemPrompt,
      userTemplate,
      isActive: true,
      authorId,
      evalScore: 0.925,
    });
  }

  static async rollback(workspaceId: string, promptVersionId: string): Promise<PromptVersion | undefined> {
    const versions = await observabilityRepository.getPrompts(workspaceId);
    const target = versions.find((v) => v.id === promptVersionId);
    if (target) {
      versions.forEach((v) => {
        if (v.promptName === target.promptName) v.isActive = false;
      });
      target.isActive = true;
    }
    return target;
  }
}
