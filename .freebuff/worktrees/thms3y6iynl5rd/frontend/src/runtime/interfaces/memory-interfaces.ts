export interface MemoryItem {
  id: string;
  workspaceId: string;
  userId: string;
  memoryType: "episodic" | "semantic" | "preference" | "entity";
  key: string;
  value: string;
  confidenceScore: number;
  createdAt: string;
}

export interface IMemoryProvider {
  saveMemory(workspaceId: string, userId: string, key: string, value: string, type?: string): Promise<MemoryItem>;
  retrieveMemories(workspaceId: string, userId: string, query: string, topK?: number): Promise<MemoryItem[]>;
  updateMemory(id: string, value: string): Promise<MemoryItem>;
  deleteMemory(id: string): Promise<boolean>;
  summarizeMemories(workspaceId: string, userId: string): Promise<string>;
  compressMemoryStore(workspaceId: string): Promise<number>;
  forgetExpired(workspaceId: string): Promise<number>;
  search(workspaceId: string, query: string): Promise<MemoryItem[]>;
}
