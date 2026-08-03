"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { ApprovalRequest } from "@/repositories/governance-repository";

export function useApprovals(orgId = "org_default") {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.governance.approvals(orgId);
      setApprovals(data);
    } catch (err) {
      console.error("[useApprovals] Failed to fetch approvals:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchApprovals();
    const unsubGranted = runtimeEventBus.subscribe("APPROVAL_GRANTED", () => fetchApprovals());
    const unsubRejected = runtimeEventBus.subscribe("APPROVAL_REJECTED", () => fetchApprovals());
    return () => {
      unsubGranted();
      unsubRejected();
    };
  }, [fetchApprovals]);

  const grantApproval = async (id: string, reason?: string) => {
    await aiRuntime.governance.grantApproval(id, reason);
    await fetchApprovals();
  };

  const rejectApproval = async (id: string, reason?: string) => {
    await aiRuntime.governance.rejectApproval(id, reason);
    await fetchApprovals();
  };

  return {
    approvals,
    isLoading,
    grantApproval,
    rejectApproval,
    refresh: fetchApprovals,
  };
}
