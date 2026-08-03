export interface AIRuntimeConfig {
  defaultProvider: string;
  defaultModel: string;
  defaultEmbeddingModel: string;
  maxContextTokens: number;
  reflectionEnabled: boolean;
  reflectionThreshold: number;
  hybridSearchTopK: number;
  graphMaxDepth: number;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
}

export const DEFAULT_RUNTIME_CONFIG: AIRuntimeConfig = {
  defaultProvider: "google",
  defaultModel: "gemini-1.5-pro",
  defaultEmbeddingModel: "text-embedding-3-small",
  maxContextTokens: 128000,
  reflectionEnabled: true,
  reflectionThreshold: 0.85,
  hybridSearchTopK: 10,
  graphMaxDepth: 2,
  retryPolicy: {
    maxRetries: 3,
    backoffMs: 1000,
  },
};
