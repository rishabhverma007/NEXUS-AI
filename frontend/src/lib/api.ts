import type {
  AgentStep,
  AuthResponse,
  AuthUser,
  ChatThread,
  Citation,
  KGVisualizationData,
  KnowledgeDocument,
  Stats,
  ThreadMessage,
  Workspace,
} from "@/types/nexus";

/** Base URL of the FastAPI backend. Override via NEXT_PUBLIC_API_URL. */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const TOKEN_STORAGE_KEY = "nexus_auth_token";
const WORKSPACE_STORAGE_KEY = "nexus_workspace_id";

export interface HealthStatus {
  status: string;
  system: string;
  version: string;
  database: "ok" | "error";
  ai_mode: "live" | "simulation";
  providers_configured: string[];
  default_model: string;
  models: Record<string, boolean>;
  embeddings: {
    mode: "live" | "mock";
    provider: string;
    model: string;
  };
}

/** Fetch the backend readiness probe (AI mode, per-model availability, DB). */
export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE}/health`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return (await response.json()) as HealthStatus;
}

// --- Session helpers ---------------------------------------------------------
// Token + workspace live in localStorage so the API client (and any component)
// can attach the bearer header without importing the React store.

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getWorkspaceId(): string {
  if (typeof window === "undefined") return "ws_default_01";
  return window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "ws_default_01";
}

export function setAuthSession(token: string, workspaceId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, workspaceId);
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
}

// --- Generic authenticated fetch --------------------------------------------

export interface ApiError extends Error {
  status?: number;
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body != null && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`) as ApiError;
    error.status = response.status;
    try {
      const body = await response.json();
      if (body && typeof body.detail === "string") error.message = body.detail;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw error;
  }
  return (await response.json()) as T;
}

// --- Authentication ----------------------------------------------------------

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ full_name: fullName, email, password }),
  });
}

export function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}

export function fetchWorkspaces(): Promise<Workspace[]> {
  return apiFetch<Workspace[]>("/workspaces");
}

// --- Chat threads & history -------------------------------------------------

export function fetchThreads(): Promise<ChatThread[]> {
  return apiFetch<ChatThread[]>("/chat/threads");
}

export function fetchThreadMessages(threadId: string): Promise<ThreadMessage[]> {
  return apiFetch<ThreadMessage[]>(
    `/chat/threads/${encodeURIComponent(threadId)}/messages`
  );
}

// --- Dashboard statistics ---------------------------------------------------

export function fetchStats(): Promise<Stats> {
  return apiFetch<Stats>("/stats");
}

// --- Chat / agent streaming --------------------------------------------------

interface StreamDoneData {
  citations: Citation[];
  reflection_score: number;
  graph?: unknown;
}

interface StreamEvent {
  type: "thread" | "agent_step" | "token" | "done" | "error";
  thread_id?: string;
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
 * Pass an existing threadId to continue a conversation, or null to auto-create
 * one (the backend emits a `thread` frame with the new id).
 * Invokes onStep/onToken/onDone as before.
 */
export async function streamAgentChat(
  prompt: string,
  modelId: string,
  agentMode: string,
  threadId: string | null,
  onThread: (threadId: string) => void,
  onStep: (step: AgentStep) => void,
  onToken: (token: string) => void,
  onDone: (data: StreamDoneData) => void
): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      thread_id: threadId,
      workspace_id: getWorkspaceId(),
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
          case "thread":
            if (event.thread_id) onThread(event.thread_id);
            break;
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

// --- Knowledge graph & documents ---------------------------------------------

/** Fetch the 3D knowledge graph visualization data. */
export async function fetchGraphVisualization(): Promise<KGVisualizationData> {
  return apiFetch<KGVisualizationData>("/graph/visualization");
}

/** Fetch all ingested knowledge documents. */
export async function fetchDocuments(): Promise<KnowledgeDocument[]> {
  return apiFetch<KnowledgeDocument[]>("/knowledge/documents");
}

/** Upload a new document to the knowledge base. */
export async function uploadDocument(
  title: string,
  content: string,
  sourceType: string = "markdown"
): Promise<KnowledgeDocument> {
  return apiFetch<KnowledgeDocument>("/knowledge/documents", {
    method: "POST",
    body: JSON.stringify({ title, content, source_type: sourceType }),
  });
}
