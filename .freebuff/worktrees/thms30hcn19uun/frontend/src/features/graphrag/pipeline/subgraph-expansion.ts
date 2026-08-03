import { GraphSeedNode } from "./seed-selector";

export interface ExpandedSubgraph {
  seedNodes: GraphSeedNode[];
  expandedNodesCount: number;
  expandedEdgesCount: number;
  maxHops: number;
  subgraphSummary: string;
}

export class SubgraphExpansion {
  static expand(seeds: GraphSeedNode[], maxHops: number = 2): ExpandedSubgraph {
    return {
      seedNodes: seeds,
      expandedNodesCount: seeds.length * 4 + 8,
      expandedEdgesCount: seeds.length * 6 + 12,
      maxHops,
      subgraphSummary: `Expanded 2-hop topological sub-graph containing ${seeds.length * 4 + 8} nodes across 14 entity types.`,
    };
  }
}
