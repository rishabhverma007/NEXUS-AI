export interface GraphSeedNode {
  id: string;
  name: string;
  entityType: string;
  seedScore: number;
  source: "retrieval" | "memory" | "keyword";
}

export class SeedSelector {
  static selectSeeds(query: string, retrievalResults: any[] = []): GraphSeedNode[] {
    const seeds: GraphSeedNode[] = [
      { id: "node_01", name: "NEXUS AI OS", entityType: "Organization", seedScore: 0.98, source: "retrieval" },
      { id: "node_02", name: "Master Architecture Spec", entityType: "Document", seedScore: 0.94, source: "retrieval" },
      { id: "node_03", name: "GraphRAG Traversal Engine", entityType: "Project", seedScore: 0.89, source: "memory" },
    ];
    return seeds;
  }
}
