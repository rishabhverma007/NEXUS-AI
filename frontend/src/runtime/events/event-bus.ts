export type RuntimeEventType =
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_PARSED"
  | "EMBEDDING_STARTED"
  | "EMBEDDING_CREATED"
  | "EMBEDDING_COMPLETED"
  | "INDEX_CREATED"
  | "INDEX_UPDATED"
  | "INDEX_REBUILT"
  | "INDEX_FAILED"
  | "REINDEX_STARTED"
  | "REINDEX_COMPLETED"
  | "SEARCH_STARTED"
  | "SEARCH_COMPLETED"
  | "AGENT_STARTED"
  | "AGENT_COMPLETED"
  | "MEMORY_UPDATED"
  | "GRAPH_UPDATED"
  | "TOOL_REGISTERED"
  | "TOOL_EXECUTION_STARTED"
  | "TOOL_EXECUTION_COMPLETED"
  | "MCP_CONNECTED"
  | "MODEL_CHANGED"
  | "WORKSPACE_CHANGED"
  | "NOTIFICATION_CREATED"
  | "AUDIT_CREATED"
  | "RESEARCH_STARTED"
  | "RESEARCH_PROGRESS_UPDATED"
  | "RESEARCH_EVIDENCE_ADDED"
  | "RESEARCH_COMPLETED"
  | "RESEARCH_FAILED"
  | "TRACE_STARTED"
  | "TRACE_COMPLETED"
  | "EVALUATION_COMPLETED"
  | "QUALITY_UPDATED"
  | "GUARDRAIL_TRIGGERED"
  | "POLICY_VIOLATION"
  | "COST_UPDATED"
  | "POLICY_CREATED"
  | "POLICY_UPDATED"
  | "SECURITY_ALERT"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_GRANTED"
  | "APPROVAL_REJECTED"
  | "COMPLIANCE_REPORT_GENERATED"
  | "LICENSE_UPDATED"
  | "WORKFLOW_CREATED"
  | "WORKFLOW_UPDATED"
  | "WORKFLOW_DEPLOYED"
  | "PROMPT_CREATED"
  | "PROMPT_TESTED"
  | "PROJECT_PUBLISHED"
  | "DEPLOYMENT_STARTED"
  | "DEPLOYMENT_COMPLETED"
  | "WORKER_STARTED"
  | "WORKER_FAILED"
  | "QUEUE_OVERFLOW"
  | "SERVICE_DEGRADED"
  | "FAILOVER_TRIGGERED"
  | "BACKUP_COMPLETED";

export interface RuntimeEventPayload<T = any> {
  type: RuntimeEventType;
  payload: T;
  timestamp: string;
}

export type EventCallback<T = any> = (event: RuntimeEventPayload<T>) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<RuntimeEventType, Set<EventCallback>> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(type: RuntimeEventType, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public publish<T = any>(type: RuntimeEventType, payload: T): void {
    const event: RuntimeEventPayload<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (error) {
          console.error(`[EventBus] Error executing callback for event '${type}':`, error);
        }
      });
    }
  }
}

export const runtimeEventBus = EventBus.getInstance();
