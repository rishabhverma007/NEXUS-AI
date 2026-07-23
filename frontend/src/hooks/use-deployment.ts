"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { DeploymentRecordItem } from "@/repositories/studio-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useDeployment() {
  const { currentWorkspace } = useNexusStore();
  const [deployments, setDeployments] = useState<DeploymentRecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeployments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.studio.getDeployments(currentWorkspace.id);
      setDeployments(data);
    } catch (err) {
      console.error("[useDeployment] Error fetching deployment records:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const deploy = async (workflowId: string, versionTag: string, env: "dev" | "staging" | "production") => {
    const record = await aiRuntime.studio.deploy(workflowId, currentWorkspace.id, versionTag, env, "usr_admin");
    await fetchDeployments();
    return record;
  };

  return {
    deployments,
    isLoading,
    deploy,
    refresh: fetchDeployments,
  };
}
