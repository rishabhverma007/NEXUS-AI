export interface EmbeddingDescriptor {
  id: string;
  provider: string;
  displayName: string;
  dimension: number;
  maxTokens: number;
  batchSize: number;
  supportedLanguages: string[];
  costPer1kToken: number;
}

export class EmbeddingRegistry {
  private static instance: EmbeddingRegistry;
  private registry: Map<string, EmbeddingDescriptor> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): EmbeddingRegistry {
    if (!EmbeddingRegistry.instance) {
      EmbeddingRegistry.instance = new EmbeddingRegistry();
    }
    return EmbeddingRegistry.instance;
  }

  private registerDefaults() {
    const embeddings: EmbeddingDescriptor[] = [
      {
        id: "text-embedding-3-small",
        provider: "openai",
        displayName: "OpenAI Text Embedding 3 Small",
        dimension: 1536,
        maxTokens: 8191,
        batchSize: 512,
        supportedLanguages: ["en", "es", "fr", "de", "zh", "ja"],
        costPer1kToken: 0.00002,
      },
      {
        id: "text-embedding-004",
        provider: "google",
        displayName: "Google Gemini Embedding 004",
        dimension: 768,
        maxTokens: 2048,
        batchSize: 256,
        supportedLanguages: ["multilingual"],
        costPer1kToken: 0.00001,
      },
      {
        id: "bge-m3-local",
        provider: "ollama",
        displayName: "BGE-M3 Multilingual Embedding (Local)",
        dimension: 1024,
        maxTokens: 8192,
        batchSize: 128,
        supportedLanguages: ["multilingual"],
        costPer1kToken: 0.0,
      },
    ];

    for (const item of embeddings) {
      this.registry.set(item.id, item);
    }
  }

  getEmbedding(id: string): EmbeddingDescriptor | undefined {
    return this.registry.get(id);
  }

  getAllEmbeddings(): EmbeddingDescriptor[] {
    return Array.from(this.registry.values());
  }
}

export const embeddingRegistry = EmbeddingRegistry.getInstance();
