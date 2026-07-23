import { observabilityRepository, RuntimeTraceSpan } from "@/repositories/observability-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class TracingEngine {
  private static activeTraces: Map<string, { traceId: string; spanId: string; startTime: number }> = new Map();

  static startTrace(
    workspaceId: string,
    operationName: string,
    component: RuntimeTraceSpan["component"],
    parentSpanId?: string,
    attributes?: Record<string, any>
  ): { traceId: string; spanId: string } {
    const traceId = `tr_${Math.random().toString(36).slice(2, 10)}`;
    const spanId = `sp_${Math.random().toString(36).slice(2, 10)}`;

    TracingEngine.activeTraces.set(spanId, {
      traceId,
      spanId,
      startTime: performance.now(),
    });

    runtimeEventBus.publish("TRACE_STARTED", {
      traceId,
      spanId,
      workspaceId,
      operationName,
      component,
      parentSpanId,
    });

    return { traceId, spanId };
  }

  static async stopTrace(
    spanId: string,
    workspaceId: string,
    operationName: string,
    component: RuntimeTraceSpan["component"],
    status: "ok" | "error" | "cancelled" = "ok",
    attributes?: Record<string, any>
  ): Promise<RuntimeTraceSpan> {
    const active = TracingEngine.activeTraces.get(spanId);
    const latencyMs = active ? Number((performance.now() - active.startTime).toFixed(2)) : 45.2;

    const span = await observabilityRepository.addTrace({
      traceId: active?.traceId || `tr_${Math.random().toString(36).slice(2, 10)}`,
      spanId,
      workspaceId,
      operationName,
      component,
      latencyMs,
      status,
      attributes,
    });

    if (active) TracingEngine.activeTraces.delete(spanId);

    runtimeEventBus.publish("TRACE_COMPLETED", {
      traceId: span.traceId,
      spanId: span.spanId,
      latencyMs: span.latencyMs,
      status: span.status,
    });

    return span;
  }
}
