export interface MemoryObjectItem {
  id: string;
  workspaceId: string;
  memoryType: "working" | "episodic" | "semantic" | "workspace" | "organization";
  key: string;
  value: string;
  importanceScore: number;
  confidenceScore: number;
  category: "preference" | "entity" | "task" | "goal" | "decision";
  lastAccessedAt: string;
  createdAt: string;
}

export class MemoryRepository {
  private static instance: MemoryRepository;

  private mockMemories: MemoryObjectItem[] = [
    {
      id: "mem_01",
      workspaceId: "ws_default_01",
      memoryType: "semantic",
      key: "preferred_architecture_stack",
      value: "User prefers Next.js 15 App Router + LangGraph FastAPI + pgvector RLS",
      importanceScore: 0.95,
      confidenceScore: 0.98,
      category: "preference",
      lastAccessedAt: "Active Now",
      createdAt: "2026-01-15T00:00:00Z"
    },
    {
      id: "mem_02",
      workspaceId: "ws_default_01",
      memoryType: "episodic",
      key: "module_05_retrieval_completion",
      value: "Engineered Hybrid RRF Fusion Engine with 60-k reciprocal rank constant",
      importanceScore: 0.88,
      confidenceScore: 0.96,
      category: "decision",
      lastAccessedAt: "2 hours ago",
      createdAt: "2026-07-23T06:00:00Z"
    }
  ];

  public static getInstance(): MemoryRepository {
    if (!MemoryRepository.instance) {
      MemoryRepository.instance = new MemoryRepository();
    }
    return MemoryRepository.instance;
  }

  async getMemories(workspaceId: string, type?: string): Promise<MemoryObjectItem[]> {
    let mems = this.mockMemories.filter((m) => m.workspaceId === workspaceId);
    if (type) {
      mems = mems.filter((m) => m.memoryType === type);
    }
    return mems;
  }

  async saveMemory(
    workspaceId: string,
    key: string,
    value: string,
    memoryType: any = "semantic",
    category: any = "preference"
  ): Promise<MemoryObjectItem> {
    const mem: MemoryObjectItem = {
      id: `mem_${Date.now()}`,
      workspaceId,
      memoryType,
      key,
      value,
      importanceScore: 0.9,
      confidenceScore: 0.95,
      category,
      lastAccessedAt: "Just now",
      createdAt: new Date().toISOString()
    };
    this.mockMemories.unshift(mem);
    return mem;
  }
}

export const memoryRepository = MemoryRepository.getInstance();
