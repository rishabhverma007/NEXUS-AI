export type StreamFrameType =
  | "token"
  | "reasoning"
  | "tool_call"
  | "status"
  | "progress"
  | "citation"
  | "done"
  | "error";

export interface StreamFrame<T = any> {
  type: StreamFrameType;
  content: T;
  timestamp: string;
}

export type StreamSubscriber = (frame: StreamFrame) => void;

export class StreamManager {
  private subscribers: Set<StreamSubscriber> = new Set();

  subscribe(subscriber: StreamSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  emit(type: StreamFrameType, content: any): void {
    const frame: StreamFrame = {
      type,
      content,
      timestamp: new Date().toISOString(),
    };
    this.subscribers.forEach((sub) => sub(frame));
  }

  emitToken(token: string): void {
    this.emit("token", token);
  }

  emitReasoning(thought: string): void {
    this.emit("reasoning", thought);
  }

  emitCitation(citation: any): void {
    this.emit("citation", citation);
  }

  emitDone(summary: any): void {
    this.emit("done", summary);
  }
}
