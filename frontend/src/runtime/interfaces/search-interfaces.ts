export interface SearchResultChunk {
  chunkId: string;
  documentId: string;
  content: string;
  tokenCount: number;
  score: number;
  metadata?: Record<string, any>;
}

export interface ISearchProvider {
  bm25Search(workspaceId: string, query: string, topK?: number): Promise<SearchResultChunk[]>;
  vectorSearch(workspaceId: string, queryEmbedding: number[], topK?: number): Promise<SearchResultChunk[]>;
  hybridSearch(workspaceId: string, query: string, topK?: number): Promise<SearchResultChunk[]>;
  graphSearch(workspaceId: string, query: string): Promise<SearchResultChunk[]>;
  webSearch(query: string): Promise<SearchResultChunk[]>;
}
