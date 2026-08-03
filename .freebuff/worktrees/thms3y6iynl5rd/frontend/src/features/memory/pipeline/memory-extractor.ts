export interface ExtractedFact {
  key: string;
  value: string;
  category: "preference" | "entity" | "task" | "goal" | "decision";
  confidence: number;
}

export class MemoryExtractor {
  static extractFromTurn(userText: string, assistantText: string): ExtractedFact[] {
    const facts: ExtractedFact[] = [];

    if (userText.toLowerCase().includes("prefer") || userText.toLowerCase().includes("always use")) {
      facts.push({
        key: "user_technology_preference",
        value: userText,
        category: "preference",
        confidence: 0.96,
      });
    }

    if (userText.toLowerCase().includes("goal") || userText.toLowerCase().includes("build")) {
      facts.push({
        key: "active_project_goal",
        value: userText,
        category: "goal",
        confidence: 0.92,
      });
    }

    return facts;
  }
}
