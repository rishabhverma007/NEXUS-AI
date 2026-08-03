export interface GraphEntityNode {
  id: string;
  name: string;
  entityType: string;
  description: string;
  properties?: Record<string, any>;
}

export interface GraphRelationEdge {
  id: string;
  source: string;
  target: string;
  relationType: string;
  weight: number;
  description: string;
}

export interface SubgraphResult {
  nodes: GraphEntityNode[];
  edges: GraphRelationEdge[];
  contextSummary: string;
}

export interface IGraphProvider {
  extractEntities(text: string): Promise<GraphEntityNode[]>;
  extractRelations(nodes: GraphEntityNode[], text: string): Promise<GraphRelationEdge[]>;
  traverseSubgraph(workspaceId: string, query: string, maxDepth?: number): Promise<SubgraphResult>;
  expandNode(nodeId: string, maxHops?: number): Promise<SubgraphResult>;
  mergeNodes(sourceNodeId: string, targetNodeId: string): Promise<boolean>;
  detectCommunities(workspaceId: string): Promise<Record<string, string[]>>;
}
