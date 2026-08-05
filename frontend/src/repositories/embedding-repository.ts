export interface EmbeddingJobItem {
  id: string;
  workspaceId: string;
  documentTitle: string;
  status: "queued" | "processing" | "embedding" | "indexing" | "completed" | "failed";
  totalChunks: number;
  processedChunks: number;
  provider: string;
  modelId: string;
  durationMs: number;
  createdAt: string;
}

export class EmbeddingRepository {
  private static instance: EmbeddingRepository;

  private mockJobs: EmbeddingJobItem[] = [
    {
      id: "job_emb_01",
      workspaceId: "ws_default_01",
      documentTitle: "NEXUS AI Master Architecture Blueprint",
      status: "completed",
      totalChunks: 12,
      processedChunks: 12,
      provider: "openai",
      modelId: "text-embedding-3-small",
      durationMs: 420,
      createdAt: "2026-07-23 06:45:10"
    },
    {
      id: "job_emb_02",
      workspaceId: "ws_default_01",
      documentTitle: "GraphRAG Subgraph Traversal Specification",
      status: "completed",
      totalChunks: 8,
      processedChunks: 8,
      provider: "openai",
      modelId: "text-embedding-3-small",
      durationMs: 310,
      createdAt: "2026-07-23 07:00:00"
    }
  ];

  public static getInstance(): EmbeddingRepository {
    if (!EmbeddingRepository.instance) {
      EmbeddingRepository.instance = new EmbeddingRepository();
    }
    return EmbeddingRepository.instance;
  }

  async getJobs(workspaceId: string): Promise<EmbeddingJobItem[]> {
    return this.mockJobs.filter((j) => j.workspaceId === workspaceId);
  }
}

export const embeddingRepository = EmbeddingRepository.getInstance();
