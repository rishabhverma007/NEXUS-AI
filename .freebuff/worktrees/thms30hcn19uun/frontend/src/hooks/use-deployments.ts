"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { DeploymentReleaseItem } from "@/repositories/operations-repository";

export function useDeployments() {
  const [releases, setReleases] = useState<DeploymentReleaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReleases = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.operations.deployments();
      setReleases(data);
    } catch (err) {
      console.error("[useDeployments] Failed to fetch releases:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const createRelease = async (tag: string, env: string, sha: string) => {
    const rel = await aiRuntime.operations.createRelease(tag, env, sha, "github-actions[bot]");
    await fetchReleases();
    return rel;
  };

  return {
    releases,
    isLoading,
    createRelease,
    refresh: fetchReleases,
  };
}
