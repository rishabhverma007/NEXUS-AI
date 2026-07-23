import { ExpandedSubgraph } from "./subgraph-expansion";
import { DiscoveredPath } from "./path-discovery";
import { TokenBudgetManager } from "@/runtime/utils/token-budget-manager";

export interface UnifiedGraphRAGContext {
  subgraph: ExpandedSubgraph;
  paths: DiscoveredPath[];
  compactGraphContextPayload: string;
  estimatedTokens: number;
}

export class GraphContextBuilder {
  static buildContext(subgraph: ExpandedSubgraph, paths: DiscoveredPath[], maxTokenBudget = 2048): UnifiedGraphRAGContext {
    const payloadLines: string[] = [
      `=== GraphRAG Subgraph Context (Hops: ${subgraph.maxHops}) ===`,
      `Seed Nodes: ${subgraph.seedNodes.map((s) => s.name).join(", ")}`,
      `Relationship Chains:`,
    ];

    paths.forEach((p) => {
      payloadLines.push(`  Path [${p.id}]: ${p.pathChain.join(" -> ")} (Weight: ${p.pathWeight})`);
    });

    const payload = payloadLines.join("\n");
    const tokens = TokenBudgetManager.estimateTokens(payload);

    return {
      subgraph,
      paths,
      compactGraphContextPayload: payload,
      estimatedTokens: tokens,
    };
  }
}
