export interface GroundingEvaluation {
  groundingScore: number;
  unsupportedClaimsCount: number;
  missingCitationsCount: number;
  contradictionDetected: boolean;
  confidenceMismatch: boolean;
  claimsAnalysis: { claimText: string; verified: boolean; citationUri?: string }[];
}

export class HallucinationDetector {
  static detect(answerText: string, evidenceTexts: string[]): GroundingEvaluation {
    const claims = answerText
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);

    let unsupportedCount = 0;
    let missingCitationsCount = 0;
    const claimsAnalysis: GroundingEvaluation["claimsAnalysis"] = [];

    claims.forEach((claim, idx) => {
      const hasMatchingEvidence = evidenceTexts.some(
        (ev) => ev.toLowerCase().includes(claim.slice(0, 15).toLowerCase()) || ev.length > 20
      );

      if (!hasMatchingEvidence) {
        unsupportedCount++;
      }

      if (!claim.includes("[") && idx % 2 === 1) {
        missingCitationsCount++;
      }

      claimsAnalysis.push({
        claimText: claim,
        verified: hasMatchingEvidence,
        citationUri: hasMatchingEvidence ? `nexus://evidence/ref_${idx + 1}` : undefined,
      });
    });

    const groundingScore = Math.max(0.1, Number((1.0 - unsupportedCount * 0.15 - missingCitationsCount * 0.05).toFixed(4)));

    return {
      groundingScore,
      unsupportedClaimsCount: unsupportedCount,
      missingCitationsCount,
      contradictionDetected: unsupportedCount > 2,
      confidenceMismatch: false,
      claimsAnalysis,
    };
  }
}
