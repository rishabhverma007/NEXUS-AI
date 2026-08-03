export interface VectorIndexItem {
  id: string;
  workspaceId: string;
  modelId: string;
  name: string;
  indexType: "hnsw" | "ivfflat";
  distanceMetric: "cosine" | "l2" | "inner_product";
  status: "building" | "ready" | "optimizing" | "failed";
  totalVectors: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexHealthMetrics {
  totalDocuments: number;
  totalChunks: number;
  indexedChunks: number;
  missingEmbeddings: number;
  orphanedChunks: number;
  healthScore: number;
}

export class IndexRepository {
  private static instance: IndexRepository;

  private mockIndexes: VectorIndexItem[] = [
    {
      id: "idx_openai_small_01",
      workspaceId: "ws_default_01",
      modelId: "text-embedding-3-small",
      name: "Nexus Default Vector Index (1536-dim HNSW)",
      indexType: "hnsw",
      distanceMetric: "cosine",
      status: "ready",
      totalVectors: 1420,
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: "2026-07-23T06:00:00Z"
    }
  ];

  public static getInstance(): IndexRepository {
    if (!IndexRepository.instance) {
      IndexRepository.instance = new IndexRepository();
    }
    return IndexRepository.instance;
  }

  async getIndexes(workspaceId: string): Promise<VectorIndexItem[]> {
    return this.mockIndexes.filter((i) => i.workspaceId === workspaceId);
  }

  async getHealthMetrics(workspaceId: string): Promise<IndexHealthMetrics> {
    return {
      totalDocuments: 6,
      totalChunks: 1420,
      indexedChunks: 1420,
      missingEmbeddings: 0,
      orphanedChunks: 0,
      healthScore: 100
    };
  }

  async triggerReindex(workspaceId: string, modelId: string): Promise<boolean> {
    const idx = this.mockIndexes.find((i) => i.workspaceId === workspaceId);
    if (idx) {
      idx.status = "optimizing";
      idx.updatedAt = new Date().toISOString();
      setTimeout(() => {
        idx.status = "ready";
      }, 1500);
    }
    return true;
  }
}

export const indexRepository = IndexRepository.getInstance();
