"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { SecurityEventLog } from "@/repositories/governance-repository";

export function useSecurity(orgId = "org_default") {
  const [events, setEvents] = useState<SecurityEventLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSecurityEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.governance.security(orgId);
      setEvents(data);
    } catch (err) {
      console.error("[useSecurity] Failed to fetch security events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchSecurityEvents();
    const unsub = runtimeEventBus.subscribe("SECURITY_ALERT", () => fetchSecurityEvents());
    return () => unsub();
  }, [fetchSecurityEvents]);

  return {
    events,
    isLoading,
    refresh: fetchSecurityEvents,
  };
}
