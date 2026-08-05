import type {
  AgentStep,
  Citation,
  KGVisualizationData,
  KnowledgeDocument,
} from "@/types/nexus";

/** Base URL of the FastAPI backend. Override via NEXT_PUBLIC_API_URL. */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface StreamDoneData {
  citations: Citation[];
  reflection_score: number;
  graph?: unknown;
}

interface StreamEvent {
  type: "agent_step" | "token" | "done" | "error";
  step?: AgentStep;
  content?: string;
  citations?: Citation[];
  reflection_score?: number;
  graph?: unknown;
  message?: string;
}

/** Parse an SSE "data: {json}" frame into an event. Returns null for blank/heartbeat lines. */
function parseSseLine(line: string): StreamEvent | null {
  if (!line.startsWith("data:")) return null;
  const payload = line.slice(5).trim();
  if (!payload) return null;
  try {
    return JSON.parse(payload) as StreamEvent;
  } catch {
    return null;
  }
}

/**
 * Stream an agentic chat response over SSE.
 * Invokes onStep for each agent step, onToken for each streamed token,
 * and onDone with the final citations + reflection score.
 */
export async function streamAgentChat(
  prompt: string,
  modelId: string,
  agentMode: string,
  onStep: (step: AgentStep) => void,
  onToken: (token: string) => void,
  onDone: (data: StreamDoneData) => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace_id: "ws_default_01",
      content: prompt,
      model: modelId,
      agent_mode: agentMode,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat stream failed: ${response.status} ${response.statusText}`);
  }
  if (!response.body) {
    throw new Error("Chat stream response has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line (\n\n)
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      for (const line of frame.split("\n")) {
        const event = parseSseLine(line);
        if (!event) continue;
        switch (event.type) {
          case "agent_step":
            if (event.step) onStep(event.step);
            break;
          case "token":
            if (event.content) onToken(event.content);
            break;
          case "done":
            onDone({
              citations: event.citations ?? [],
              reflection_score: event.reflection_score ?? 0,
              graph: event.graph,
            });
            break;
          case "error":
            throw new Error(event.message ?? "Agent pipeline error");
        }
      }
    }
  }
}

/** Fetch the 3D knowledge graph visualization data. */
export async function fetchGraphVisualization(): Promise<KGVisualizationData> {
  const response = await fetch(`${API_BASE}/graph/visualization`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Graph fetch failed: ${response.status}`);
  }
  return (await response.json()) as KGVisualizationData;
}

/** Fetch all ingested knowledge documents. */
export async function fetchDocuments(): Promise<KnowledgeDocument[]> {
  const response = await fetch(`${API_BASE}/knowledge/documents`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Documents fetch failed: ${response.status}`);
  }
  return (await response.json()) as KnowledgeDocument[];
}

/** Upload a new document to the knowledge base. */
export async function uploadDocument(
  title: string,
  content: string,
  sourceType: string = "markdown"
): Promise<KnowledgeDocument> {
  const response = await fetch(`${API_BASE}/knowledge/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace_id: "ws_default_01",
      title,
      content,
      source_type: sourceType,
    }),
  });
  if (!response.ok) {
    throw new Error(`Document upload failed: ${response.status}`);
  }
  return (await response.json()) as KnowledgeDocument;
}
