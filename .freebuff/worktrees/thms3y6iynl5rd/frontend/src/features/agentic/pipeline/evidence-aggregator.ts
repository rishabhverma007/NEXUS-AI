export interface AggregatedEvidence {
  id: string;
  documentTitle: string;
  content: string;
  relevanceScore: number;
  citationId: string;
}

export class EvidenceAggregator {
  static aggregate(retrievedChunks: any[]): AggregatedEvidence[] {
    return retrievedChunks.map((chunk, idx) => ({
      id: chunk.chunkId || `ev_${idx + 1}`,
      documentTitle: chunk.documentTitle || "Master Architecture Spec",
      content: chunk.content,
      relevanceScore: chunk.rerankScore || 0.95,
      citationId: `[Ref-${idx + 1}]`,
    }));
  }
}
