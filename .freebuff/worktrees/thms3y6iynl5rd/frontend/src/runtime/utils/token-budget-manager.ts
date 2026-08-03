export interface TokenBreakdown {
  promptTokens: number;
  retrievalTokens: number;
  memoryTokens: number;
  graphTokens: number;
  totalEstimatedTokens: number;
}

export class TokenBudgetManager {
  static estimateTokens(text: string): number {
    if (!text) return 0;
    // Standard rule-of-thumb: ~1.3 tokens per word
    return Math.ceil(text.trim().split(/\s+/).length * 1.3);
  }

  static calculateBreakdown(
    userPrompt: string,
    vectorContext: string = "",
    memoryContext: string = "",
    graphContext: string = ""
  ): TokenBreakdown {
    const promptTokens = TokenBudgetManager.estimateTokens(userPrompt);
    const retrievalTokens = TokenBudgetManager.estimateTokens(vectorContext);
    const memoryTokens = TokenBudgetManager.estimateTokens(memoryContext);
    const graphTokens = TokenBudgetManager.estimateTokens(graphContext);
    const totalEstimatedTokens = promptTokens + retrievalTokens + memoryTokens + graphTokens;

    return {
      promptTokens,
      retrievalTokens,
      memoryTokens,
      graphTokens,
      totalEstimatedTokens,
    };
  }

  static compressContext(text: string, maxAllowedTokens: number): string {
    const estimated = TokenBudgetManager.estimateTokens(text);
    if (estimated <= maxAllowedTokens) return text;

    const words = text.split(/\s+/);
    const targetWordCount = Math.floor(maxAllowedTokens / 1.3);
    return words.slice(0, targetWordCount).join(" ") + "... [Compressed Context]";
  }
}
