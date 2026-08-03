"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { GovernancePolicy } from "@/repositories/governance-repository";

export function usePolicies(orgId = "org_default") {
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.governance.policies(orgId);
      setPolicies(data);
    } catch (err) {
      console.error("[usePolicies] Failed to fetch policies:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchPolicies();
    const unsubCreated = runtimeEventBus.subscribe("POLICY_CREATED", () => fetchPolicies());
    const unsubUpdated = runtimeEventBus.subscribe("POLICY_UPDATED", () => fetchPolicies());
    return () => {
      unsubCreated();
      unsubUpdated();
    };
  }, [fetchPolicies]);

  const createPolicy = async (name: string, type: GovernancePolicy["policyType"], desc: string, rules: any, reqAppr: boolean) => {
    return aiRuntime.governance.createPolicy(orgId, name, type, desc, rules, reqAppr);
  };

  return {
    policies,
    isLoading,
    createPolicy,
    refresh: fetchPolicies,
  };
}
