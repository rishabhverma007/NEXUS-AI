export interface PromptTemplate {
  id: string;
  version: string;
  category: "system" | "planner" | "retriever" | "generator" | "reflection" | "toolcalling";
  description: string;
  variables: string[];
  template: string;
  author: string;
  updatedAt: string;
}

export class PromptRegistry {
  private static instance: PromptRegistry;
  private registry: Map<string, PromptTemplate> = new Map();

  private constructor() {
    this.registerDefaultPrompts();
  }

  public static getInstance(): PromptRegistry {
    if (!PromptRegistry.instance) {
      PromptRegistry.instance = new PromptRegistry();
    }
    return PromptRegistry.instance;
  }

  private registerDefaultPrompts() {
    const prompts: PromptTemplate[] = [
      {
        id: "SYSTEM_PRIMARY_NEXUS",
        version: "1.0.0",
        category: "system",
        description: "Primary system prompt for NEXUS AI Enterprise OS",
        variables: ["workspaceName", "userName", "activeMode"],
        template: "You are NEXUS AI, the Lead AI Architect operating in workspace '{{workspaceName}}' for user '{{userName}}'. Active Mode: {{activeMode}}. Respond with strict architectural precision.",
        author: "Principal Architect",
        updatedAt: "2026-07-23",
      },
      {
        id: "PLANNER_ROUTER",
        version: "1.0.0",
        category: "planner",
        description: "Router Agent task decomposition prompt",
        variables: ["userQuery"],
        template: "Analyze the following enterprise query: '{{userQuery}}'. Decompose intent into Vector RAG, GraphRAG, or Memory recall requirements.",
        author: "Principal Architect",
        updatedAt: "2026-07-23",
      },
      {
        id: "REFLECTION_VERIFIER",
        version: "1.0.0",
        category: "reflection",
        description: "Factual consistency verification prompt",
        variables: ["citations", "responseCandidate"],
        template: "Evaluate factual consistency of candidate response against citations:\nCitations: {{citations}}\nCandidate: {{responseCandidate}}\nOutput zero hallucination score [0.0 - 1.0].",
        author: "Principal Architect",
        updatedAt: "2026-07-23",
      },
    ];

    for (const p of prompts) {
      this.registry.set(p.id, p);
    }
  }

  getPrompt(id: string): PromptTemplate | undefined {
    return this.registry.get(id);
  }

  registerPrompt(template: PromptTemplate) {
    this.registry.set(template.id, template);
  }
}

export const promptRegistry = PromptRegistry.getInstance();
