import { ResearchEvidence, ResearchHypothesis } from "@/repositories/research-repository";

export interface HypothesisEvaluationResult {
  updatedHypotheses: Omit<ResearchHypothesis, "id" | "createdAt" | "updatedAt">[];
  overallConfidence: number;
  openGapsDetected: string[];
}

export class HypothesisEngine {
  static evaluateHypotheses(
    sessionId: string,
    workspaceId: string,
    initialHypothesisStatements: string[],
    evidenceList: ResearchEvidence[]
  ): HypothesisEvaluationResult {
    const updatedHypotheses: Omit<ResearchHypothesis, "id" | "createdAt" | "updatedAt">[] = [];
    const openGapsDetected: string[] = [];

    initialHypothesisStatements.forEach((statement, idx) => {
      const supportingIds = evidenceList
        .filter((e) => e.relevanceScore >= 0.85 && e.credibilityScore >= 0.85)
        .map((e) => e.id);

      const refutingIds = evidenceList
        .filter((e) => e.relevanceScore < 0.6)
        .map((e) => e.id);

      let status: ResearchHypothesis["status"] = "open";
      let confidence = 0.5;

      if (supportingIds.length >= 2) {
        status = "supported";
        confidence = Math.min(0.98, 0.75 + supportingIds.length * 0.05);
      } else if (refutingIds.length > supportingIds.length) {
        status = "refuted";
        confidence = 0.4;
        openGapsDetected.push(`Contradiction detected for hypothesis #${idx + 1}: ${statement.slice(0, 50)}`);
      } else {
        status = "inconclusive";
        confidence = 0.62;
        openGapsDetected.push(`Insufficient evidence depth for hypothesis #${idx + 1}. Requires follow-up iteration.`);
      }

      updatedHypotheses.push({
        sessionId,
        workspaceId,
        statement,
        status,
        confidence: Number(confidence.toFixed(4)),
        supportingEvidenceIds: supportingIds,
        refutingEvidenceIds: refutingIds,
      });
    });

    const totalConf = updatedHypotheses.reduce((acc, h) => acc + h.confidence, 0);
    const overallConfidence = updatedHypotheses.length > 0 ? totalConf / updatedHypotheses.length : 0.85;

    return {
      updatedHypotheses,
      overallConfidence: Number(overallConfidence.toFixed(4)),
      openGapsDetected,
    };
  }
}
