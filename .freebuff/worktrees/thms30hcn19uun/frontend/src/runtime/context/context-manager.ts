import { TokenBudgetManager, TokenBreakdown } from "../utils/token-budget-manager";

export interface UnifiedRuntimeContext {
  workspaceId: string;
  userId: string;
  userPrompt: string;
  systemPrompt: string;
  vectorContext: string;
  graphContext: string;
  memoryContext: string;
  tokenBreakdown: TokenBreakdown;
  assembledAt: string;
}

export class ContextManager {
  static buildRuntimeContext(
    workspaceId: string,
    userId: string,
    userPrompt: string,
    systemPrompt: string,
    vectorContext: string = "",
    graphContext: string = "",
    memoryContext: string = "",
    maxBudget: number = 128000
  ): UnifiedRuntimeContext {
    let breakdown = TokenBudgetManager.calculateBreakdown(userPrompt, vectorContext, memoryContext, graphContext);

    // Compress vector context if total tokens exceed budget
    let compressedVectorContext = vectorContext;
    if (breakdown.totalEstimatedTokens > maxBudget) {
      compressedVectorContext = TokenBudgetManager.compressContext(vectorContext, Math.floor(maxBudget * 0.5));
      breakdown = TokenBudgetManager.calculateBreakdown(userPrompt, compressedVectorContext, memoryContext, graphContext);
    }

    return {
      workspaceId,
      userId,
      userPrompt,
      systemPrompt,
      vectorContext: compressedVectorContext,
      graphContext,
      memoryContext,
      tokenBreakdown: breakdown,
      assembledAt: new Date().toISOString(),
    };
  }
}
