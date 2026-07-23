export type FeatureEnvironment = "experimental" | "beta" | "production" | "internal" | "hidden";

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  environment: FeatureEnvironment;
  enabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: Record<string, FeatureFlag> = {
  graph_rag_3d: {
    key: "graph_rag_3d",
    name: "3D GraphRAG Visualizer",
    description: "Interactive WebGL force-directed 3D knowledge graph viewer",
    environment: "production",
    enabled: true,
  },
  reflection_engine: {
    key: "reflection_engine",
    name: "Reflection Factual Evaluator",
    description: "Automated hallucination scoring double-check verification loop",
    environment: "production",
    enabled: true,
  },
  episodic_memory: {
    key: "episodic_memory",
    name: "Long-Term Episodic Memory",
    description: "Distill conversation turns into persistent user vectors",
    environment: "beta",
    enabled: true,
  },
  local_ollama: {
    key: "local_ollama",
    name: "Local Offline Ollama Endpoint",
    description: "Local inference fallback for privacy-conscious enterprise users",
    environment: "experimental",
    enabled: true,
  },
};
