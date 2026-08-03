"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { PromptTemplateItem } from "@/repositories/studio-repository";
import { PromptTestResult } from "@/features/studio/pipeline/prompt-studio-engine";
import { useNexusStore } from "@/stores/nexus-store";

export function usePromptStudio() {
  const { currentWorkspace } = useNexusStore();
  const [prompts, setPrompts] = useState<PromptTemplateItem[]>([]);
  const [testResult, setTestResult] = useState<PromptTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.studio.prompts(currentWorkspace.id);
      setPrompts(data);
    } catch (err) {
      console.error("[usePromptStudio] Error fetching prompt templates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace.id]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const testPrompt = async (systemPrompt: string, userTemplate: string, variablesMap: Record<string, string>) => {
    const res = await aiRuntime.studio.testPrompt(systemPrompt, userTemplate, variablesMap);
    setTestResult(res);
    return res;
  };

  return {
    prompts,
    testResult,
    isLoading,
    testPrompt,
    refresh: fetchPrompts,
  };
}
