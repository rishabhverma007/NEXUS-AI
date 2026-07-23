export class ImportanceEngine {
  static calculateImportance(key: string, value: string): number {
    let score = 0.5;
    if (key.includes("preference") || key.includes("goal")) {
      score += 0.35;
    }
    if (value.length > 50) {
      score += 0.1;
    }
    return Math.min(1.0, parseFloat(score.toFixed(2)));
  }
}
