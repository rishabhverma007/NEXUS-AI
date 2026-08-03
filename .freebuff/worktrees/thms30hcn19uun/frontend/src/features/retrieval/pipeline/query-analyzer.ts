export type QueryIntent = "conceptual" | "factoid" | "procedural" | "navigational";

export interface AnalyzedQuery {
  rawQuery: string;
  intent: QueryIntent;
  language: string;
  complexityScore: number;
  extractedEntities: string[];
  suggestedMode: "fast" | "balanced" | "deep" | "research";
}

export class QueryAnalyzer {
  static analyze(query: string): AnalyzedQuery {
    const trimmed = query.trim();
    const words = trimmed.split(/\s+/);
    
    let intent: QueryIntent = "conceptual";
    if (trimmed.toLowerCase().startsWith("how to") || trimmed.toLowerCase().includes("step")) {
      intent = "procedural";
    } else if (words.length <= 3) {
      intent = "factoid";
    }

    const entities = words.filter((w) => /^[A-Z][a-z]+$/.test(w));

    return {
      rawQuery: trimmed,
      intent,
      language: "en",
      complexityScore: Math.min(1.0, words.length / 20),
      extractedEntities: entities,
      suggestedMode: words.length > 8 ? "deep" : "balanced",
    };
  }
}
