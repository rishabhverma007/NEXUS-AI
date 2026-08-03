"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { GuardrailEvent } from "@/repositories/observability-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useGuardrails() {
  const { currentWorkspace } = useNexusStore();
  const [events, setEvents] = useState<GuardrailEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.guardrails.listEvents(currentWorkspace.id);
      setEvents(data);
    } catch (err) {
      console.error("[useGuardrails] Failed to fetch guardrail events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchEvents();
    const unsub = runtimeEventBus.subscribe("GUARDRAIL_TRIGGERED", () => {
      fetchEvents();
    });
    return () => unsub();
  }, [fetchEvents]);

  const validatePrompt = async (userId: string, text: string) => {
    return aiRuntime.guardrails.validate(currentWorkspace.id, userId, text);
  };

  return {
    events,
    isLoading,
    validatePrompt,
    refresh: fetchEvents,
  };
}
