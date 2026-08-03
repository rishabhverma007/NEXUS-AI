export type ProviderId = "google" | "openai" | "anthropic" | "groq" | "ollama" | "openrouter";

export interface ModelDescriptor {
  id: string;
  provider: ProviderId;
  displayName: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  supportsStructuredOutput: boolean;
  supportsThinking: boolean;
  supportsEmbeddings: boolean;
  costPer1kInputToken: number;
  costPer1kOutputToken: number;
  latencyEstimateMs: number;
  status: "active" | "deprecated" | "maintenance";
}

export class ModelRegistry {
  private static instance: ModelRegistry;
  private registry: Map<string, ModelDescriptor> = new Map();

  private constructor() {
    this.registerDefaultModels();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  private registerDefaultModels() {
    const models: ModelDescriptor[] = [
      {
        id: "gemini-1.5-pro",
        provider: "google",
        displayName: "Google Gemini 1.5 Pro",
        contextWindow: 1000000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStructuredOutput: true,
        supportsThinking: true,
        supportsEmbeddings: true,
        costPer1kInputToken: 0.00125,
        costPer1kOutputToken: 0.005,
        latencyEstimateMs: 250,
        status: "active",
      },
      {
        id: "gpt-4o",
        provider: "openai",
        displayName: "OpenAI GPT-4o Enterprise",
        contextWindow: 128000,
        maxOutputTokens: 4096,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStructuredOutput: true,
        supportsThinking: false,
        supportsEmbeddings: true,
        costPer1kInputToken: 0.0025,
        costPer1kOutputToken: 0.01,
        latencyEstimateMs: 320,
        status: "active",
      },
      {
        id: "claude-3-5-sonnet",
        provider: "anthropic",
        displayName: "Anthropic Claude 3.5 Sonnet",
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStructuredOutput: true,
        supportsThinking: false,
        supportsEmbeddings: false,
        costPer1kInputToken: 0.003,
        costPer1kOutputToken: 0.015,
        latencyEstimateMs: 280,
        status: "active",
      },
      {
        id: "deepseek-r1",
        provider: "groq",
        displayName: "DeepSeek R1 Reasoning",
        contextWindow: 128000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsVision: false,
        supportsFunctionCalling: true,
        supportsStructuredOutput: true,
        supportsThinking: true,
        supportsEmbeddings: false,
        costPer1kInputToken: 0.0005,
        costPer1kOutputToken: 0.002,
        latencyEstimateMs: 120,
        status: "active",
      },
      {
        id: "ollama-llama3.3",
        provider: "ollama",
        displayName: "Ollama Llama 3.3 (Local)",
        contextWindow: 128000,
        maxOutputTokens: 4096,
        supportsStreaming: true,
        supportsVision: false,
        supportsFunctionCalling: true,
        supportsStructuredOutput: true,
        supportsThinking: false,
        supportsEmbeddings: true,
        costPer1kInputToken: 0.0,
        costPer1kOutputToken: 0.0,
        latencyEstimateMs: 90,
        status: "active",
      },
    ];

    for (const model of models) {
      this.registry.set(model.id, model);
    }
  }

  registerModel(descriptor: ModelDescriptor) {
    this.registry.set(descriptor.id, descriptor);
  }

  getModel(id: string): ModelDescriptor | undefined {
    return this.registry.get(id);
  }

  getAllModels(): ModelDescriptor[] {
    return Array.from(this.registry.values());
  }

  getModelsByProvider(provider: ProviderId): ModelDescriptor[] {
    return this.getAllModels().filter((m) => m.provider === provider);
  }
}

export const modelRegistry = ModelRegistry.getInstance();
