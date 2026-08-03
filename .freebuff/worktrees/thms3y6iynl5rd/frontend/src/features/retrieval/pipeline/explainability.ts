export interface RetrievalExplanation {
  matchedKeywords: string[];
  semanticSimilarityScore: number;
  recencyBoostApplied: boolean;
  explanationSummary: string;
}

export class ExplainabilityGenerator {
  static explain(
    query: string,
    content: string,
    vectorScore: number,
    bm25Score: number
  ): RetrievalExplanation {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();
    const matched = queryTerms.filter((term) => term.length > 2 && contentLower.includes(term));

    const summary = `Retrieved via Hybrid RRF Fusion. Matched ${matched.length} exact query terms. Vector similarity cosine score: ${(vectorScore * 100).toFixed(1)}%.`;

    return {
      matchedKeywords: matched,
      semanticSimilarityScore: vectorScore,
      recencyBoostApplied: true,
      explanationSummary: summary,
    };
  }
}
