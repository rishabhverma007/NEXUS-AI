"use client";

import { useState } from "react";
import { HybridRetrievalEngine, RetrievalPipelineResult } from "@/features/retrieval/pipeline/hybrid-engine";
import { useNexusStore } from "@/stores/nexus-store";

export function useHybridSearch() {
  const { currentWorkspace } = useNexusStore();
  const [result, setResult] = useState<RetrievalPipelineResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = async (query: string, mode: "fast" | "balanced" | "deep" | "research" = "balanced") => {
    if (!query.trim()) return;
    setIsSearching(true);
    const res = await HybridRetrievalEngine.search(query, currentWorkspace.id, mode);
    setResult(res);
    setIsSearching(false);
  };

  return {
    result,
    isSearching,
    executeSearch,
  };
}
