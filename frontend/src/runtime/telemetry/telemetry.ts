export interface TelemetryEvent {
  id: string;
  provider: string;
  modelId: string;
  latencyMs: number;
  promptTokens: number;
  responseTokens: number;
  toolUsageCount: number;
  status: "success" | "error";
  timestamp: string;
}

export class TelemetryTracker {
  private static instance: TelemetryTracker;
  private events: TelemetryEvent[] = [];

  public static getInstance(): TelemetryTracker {
    if (!TelemetryTracker.instance) {
      TelemetryTracker.instance = new TelemetryTracker();
    }
    return TelemetryTracker.instance;
  }

  recordEvent(event: Omit<TelemetryEvent, "id" | "timestamp">): TelemetryEvent {
    const fullEvent: TelemetryEvent = {
      ...event,
      id: `tel_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.events.push(fullEvent);
    return fullEvent;
  }

  getMetricsSummary(): { totalRequests: number; avgLatencyMs: number; totalTokens: number } {
    if (this.events.length === 0) return { totalRequests: 0, avgLatencyMs: 0, totalTokens: 0 };
    const totalLatency = this.events.reduce((acc, e) => acc + e.latencyMs, 0);
    const totalTokens = this.events.reduce((acc, e) => acc + e.promptTokens + e.responseTokens, 0);
    return {
      totalRequests: this.events.length,
      avgLatencyMs: Math.round(totalLatency / this.events.length),
      totalTokens,
    };
  }
}

export const telemetryTracker = TelemetryTracker.getInstance();
