export interface CandidateResult {
  chunkId: string;
  documentTitle: string;
  content: string;
  bm25Score: number;
  vectorScore: number;
  pageNumber: number;
  heading: string;
}

export interface FusedResult extends CandidateResult {
  rrfScore: number;
}

export class FusionEngine {
  static reciprocalRankFusion(
    bm25List: CandidateResult[],
    vectorList: CandidateResult[],
    k: number = 60
  ): FusedResult[] {
    const scoreMap = new Map<string, { item: CandidateResult; rrf: number }>();

    // Rank BM25 results
    bm25List.forEach((item, rank) => {
      const rrf = 1 / (k + rank + 1);
      scoreMap.set(item.chunkId, { item, rrf });
    });

    // Rank Vector results
    vectorList.forEach((item, rank) => {
      const rrf = 1 / (k + rank + 1);
      const existing = scoreMap.get(item.chunkId);
      if (existing) {
        existing.rrf += rrf;
        existing.item.vectorScore = item.vectorScore;
      } else {
        scoreMap.set(item.chunkId, { item, rrf });
      }
    });

    const fused: FusedResult[] = [];
    scoreMap.forEach(({ item, rrf }) => {
      fused.push({ ...item, rrfScore: parseFloat(rrf.toFixed(4)) });
    });

    return fused.sort((a, b) => b.rrfScore - a.rrfScore);
  }
}
