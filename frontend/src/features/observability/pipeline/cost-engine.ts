import { observabilityRepository, CostReport } from "@/repositories/observability-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class CostEngine {
  private static promptCostPer1k = 0.00015;
  private static completionCostPer1k = 0.00060;
  private static embeddingCostPer1k = 0.00002;

  static calculateCost(promptTokens: number, completionTokens: number, embeddingTokens: number): number {
    const pCost = (promptTokens / 1000) * CostEngine.promptCostPer1k;
    const cCost = (completionTokens / 1000) * CostEngine.completionCostPer1k;
    const eCost = (embeddingTokens / 1000) * CostEngine.embeddingCostPer1k;
    return Number((pCost + cCost + eCost).toFixed(6));
  }

  static async recordUsage(
    workspaceId: string,
    modelId: string,
    promptTokens: number,
    completionTokens: number,
    embeddingTokens: number = 0,
    agentRole?: string,
    toolId?: string
  ): Promise<CostReport> {
    const totalTokens = promptTokens + completionTokens + embeddingTokens;
    const estimatedCostUsd = CostEngine.calculateCost(promptTokens, completionTokens, embeddingTokens);

    const costReport = await observabilityRepository.recordCost({
      workspaceId,
      modelId,
      agentRole,
      toolId,
      promptTokens,
      completionTokens,
      embeddingTokens,
      totalTokens,
      estimatedCostUsd,
    });

    runtimeEventBus.publish("COST_UPDATED", {
      workspaceId,
      totalTokens,
      estimatedCostUsd,
      agentRole,
      toolId,
    });

    return costReport;
  }

  static async getWorkspaceCostSummary(workspaceId: string): Promise<{
    totalTokens: number;
    totalCostUsd: number;
    agentCostBreakdown: Record<string, number>;
  }> {
    const reports = await observabilityRepository.getCosts(workspaceId);
    let totalTokens = 0;
    let totalCostUsd = 0;
    const agentCostBreakdown: Record<string, number> = {};

    reports.forEach((r) => {
      totalTokens += r.totalTokens;
      totalCostUsd += r.estimatedCostUsd;
      const role = r.agentRole || "general";
      agentCostBreakdown[role] = (agentCostBreakdown[role] || 0) + r.estimatedCostUsd;
    });

    return {
      totalTokens,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      agentCostBreakdown,
    };
  }
}
