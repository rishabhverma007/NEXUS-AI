"use client";

import { useState } from "react";
import { SeedSelector } from "@/features/graphrag/pipeline/seed-selector";
import { SubgraphExpansion, ExpandedSubgraph } from "@/features/graphrag/pipeline/subgraph-expansion";
import { PathDiscovery, DiscoveredPath } from "@/features/graphrag/pipeline/path-discovery";
import { GraphContextBuilder, UnifiedGraphRAGContext } from "@/features/graphrag/pipeline/graph-context-builder";

export function useGraphRAG() {
  const [graphContext, setGraphContext] = useState<UnifiedGraphRAGContext | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const runGraphRAG = async (query: string, maxHops = 2) => {
    setIsExpanding(true);
    const seeds = SeedSelector.selectSeeds(query);
    const subgraph = SubgraphExpansion.expand(seeds, maxHops);
    const paths = PathDiscovery.discoverPaths(seeds.map((s) => s.id));
    const ctx = GraphContextBuilder.buildContext(subgraph, paths);
    setGraphContext(ctx);
    setIsExpanding(false);
  };

  return {
    graphContext,
    isExpanding,
    runGraphRAG,
  };
}
