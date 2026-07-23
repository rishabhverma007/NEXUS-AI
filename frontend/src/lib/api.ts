import { AgentMode, AgentStep, Citation, KGVisualizationData, KnowledgeDocument } from "@/types/nexus";

type StepCallback = (step: AgentStep) => void;
type TokenCallback = (token: string) => void;
type CompletionCallback = (data: { citations: Citation[]; reflection_score: number }) => void;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Stream an agent chat response from the backend.
 * Calls stepCallback for each agent step update, tokenCallback for each
 * streaming token, and completionCallback when the response is fully received.
 */
export async function streamAgentChat(
  prompt: string,
  model: string,
  mode: AgentMode,
  stepCallback: StepCallback,
  tokenCallback: TokenCallback,
  completionCallback: CompletionCallback
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model, mode }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body for streaming");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const dataStr = line.slice(6).trim();

        // SSE event: step update
        if (dataStr.startsWith('{"step_id":')) {
          try {
            const step: AgentStep = JSON.parse(dataStr);
            stepCallback(step);
          } catch {
            // skip malformed step
          }
          continue;
        }

        // SSE event: token chunk
        if (dataStr.startsWith('{"token":')) {
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.token) {
              tokenCallback(parsed.token);
            }
          } catch {
            // skip malformed token
          }
          continue;
        }

        // SSE event: completion with citations
        if (dataStr.startsWith('{"citations":')) {
          try {
            const completion: { citations: Citation[]; reflection_score: number } = JSON.parse(dataStr);
            completionCallback(completion);
          } catch {
            // skip malformed completion
          }
          continue;
        }
      }
    }
  } catch (err) {
    console.error("streamAgentChat error:", err);
    throw err;
  }
}

/**
 * Fetch a list of ingested documents from the backend.
 */
export async function fetchDocuments(): Promise<KnowledgeDocument[]> {
  try {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error(`Failed to fetch documents: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchDocuments failed, returning empty list:", err);
    return [];
  }
}

/**
 * Upload a new document for chunking and indexing.
 */
export async function uploadDocument(
  title: string,
  content: string,
  sourceType: string
): Promise<KnowledgeDocument> {
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, source_type: sourceType }),
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return await res.json();
}

/**
 * Fetch mock knowledge graph visualization data for the 3D visualizer.
 * In production this would call the backend GraphRAG endpoint.
 */
export async function fetchGraphVisualization(): Promise<KGVisualizationData> {
  // Return richly structured mock data so the 3D visualizer has entities to render
  return {
    nodes: [
      { id: "n1", name: "NEXUS Core", entity_type: "System", description: "Enterprise AI Operating System Core" },
      { id: "n2", name: "Multi-Agent RAG", entity_type: "Architecture", description: "Multi-Agent Retrieval Augmented Generation Pipeline" },
      { id: "n3", name: "GraphRAG Engine", entity_type: "Module", description: "Graph-based traversal and entity extraction engine" },
      { id: "n4", name: "PGVector Store", entity_type: "Database", description: "PostgreSQL with pgvector for HNSW cosine search" },
      { id: "n5", name: "Reflection Engine", entity_type: "Module", description: "Factual accuracy verification and hallucination guardrail" },
      { id: "n6", name: "Memory Service", entity_type: "Service", description: "Episodic and semantic long-term memory management" },
      { id: "n7", name: "Eval Dashboard", entity_type: "UI", description: "Real-time quality score and evaluation metrics dashboard" },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", relation_type: "deploys", weight: 1.0, description: "Core deploys Multi-Agent RAG" },
      { id: "e2", source: "n1", target: "n3", relation_type: "deploys", weight: 1.0, description: "Core deploys GraphRAG Engine" },
      { id: "e3", source: "n2", target: "n4", relation_type: "queries", weight: 0.9, description: "RAG queries PGVector Store" },
      { id: "e4", source: "n3", target: "n4", relation_type: "queries", weight: 0.85, description: "GraphRAG queries PGVector Store" },
      { id: "e5", source: "n2", target: "n5", relation_type: "reflects_on", weight: 0.95, description: "RAG results verified by Reflection" },
      { id: "e6", source: "n1", target: "n6", relation_type: "deploys", weight: 0.9, description: "Core deploys Memory Service" },
      { id: "e7", source: "n1", target: "n7", relation_type: "deploys", weight: 0.8, description: "Core deploys Eval Dashboard" },
      { id: "e8", source: "n6", target: "n4", relation_type: "persists_to", weight: 0.75, description: "Memory persists to PGVector" },
    ],
    stats: {
      total_nodes: 7,
      total_edges: 8,
    },
  };
}
