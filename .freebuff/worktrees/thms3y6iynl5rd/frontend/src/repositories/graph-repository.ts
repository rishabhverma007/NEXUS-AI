export interface GraphNodeItem {
  id: string;
  workspaceId: string;
  name: string;
  entityType: string;
  description: string;
}

export interface GraphEdgeItem {
  id: string;
  workspaceId: string;
  source: string;
  target: string;
  relationType: string;
  weight: number;
}

export class GraphRepository {
  private static instance: GraphRepository;

  private mockNodes: GraphNodeItem[] = [
    { id: "node_01", workspaceId: "ws_default_01", name: "NEXUS AI OS", entityType: "Organization", description: "Enterprise AI Knowledge Operating System" },
    { id: "node_02", workspaceId: "ws_default_01", name: "Master Architecture Spec", entityType: "Document", description: "5-Tier Multi-Agent System Architecture" },
    { id: "node_03", workspaceId: "ws_default_01", name: "GraphRAG Traversal Engine", entityType: "Project", description: "2-Hop topological sub-graph traversal" },
    { id: "node_04", workspaceId: "ws_default_01", name: "LangGraph Router Agent", entityType: "Agent", description: "Autonomous Intent Routing Agent" },
  ];

  private mockEdges: GraphEdgeItem[] = [
    { id: "edge_01", workspaceId: "ws_default_01", source: "node_01", target: "node_02", relationType: "contains", weight: 1.0 },
    { id: "edge_02", workspaceId: "ws_default_01", source: "node_02", target: "node_03", relationType: "references", weight: 0.9 },
    { id: "edge_03", workspaceId: "ws_default_01", source: "node_03", target: "node_04", relationType: "depends_on", weight: 0.95 },
  ];

  public static getInstance(): GraphRepository {
    if (!GraphRepository.instance) {
      GraphRepository.instance = new GraphRepository();
    }
    return GraphRepository.instance;
  }

  async getGraph(workspaceId: string): Promise<{ nodes: GraphNodeItem[]; edges: GraphEdgeItem[] }> {
    return {
      nodes: this.mockNodes.filter((n) => n.workspaceId === workspaceId),
      edges: this.mockEdges.filter((e) => e.workspaceId === workspaceId),
    };
  }

  async traverseSubgraph(workspaceId: string, nodeId: string): Promise<{ nodes: GraphNodeItem[]; edges: GraphEdgeItem[] }> {
    const connectedEdges = this.mockEdges.filter((e) => e.source === nodeId || e.target === nodeId);
    const connectedNodeIds = new Set([nodeId, ...connectedEdges.map((e) => (e.source === nodeId ? e.target : e.source))]);
    const connectedNodes = this.mockNodes.filter((n) => connectedNodeIds.has(n.id));

    return { nodes: connectedNodes, edges: connectedEdges };
  }
}

export const graphRepository = GraphRepository.getInstance();
