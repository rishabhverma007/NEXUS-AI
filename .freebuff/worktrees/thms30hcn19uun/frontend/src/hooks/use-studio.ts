"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { studioRepository, StudioProjectItem } from "@/repositories/studio-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useStudio() {
  const { currentWorkspace } = useNexusStore();
  const [projects, setProjects] = useState<StudioProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.studio.projects(currentWorkspace.id);
      setProjects(data);
    } catch (err) {
      console.error("[useStudio] Error fetching studio projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string, description: string, category: StudioProjectItem["category"]) => {
    const p = await aiRuntime.studio.createProject({
      workspaceId: currentWorkspace.id,
      userId: "usr_01",
      name,
      description,
      category,
      status: "active",
    });
    await fetchProjects();
    return p;
  };

  return {
    projects,
    isLoading,
    createProject,
    refresh: fetchProjects,
  };
}
