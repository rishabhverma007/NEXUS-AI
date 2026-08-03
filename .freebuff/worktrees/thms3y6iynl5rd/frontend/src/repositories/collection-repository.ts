export interface KnowledgeCollectionItem {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  documentCount: number;
  createdAt: string;
}

export interface KnowledgeFolderItem {
  id: string;
  collectionId: string;
  workspaceId: string;
  parentFolderId?: string;
  name: string;
  createdAt: string;
}

export class CollectionRepository {
  private static instance: CollectionRepository;

  private mockCollections: KnowledgeCollectionItem[] = [
    {
      id: "col_arch_01",
      workspaceId: "ws_default_01",
      name: "System Architecture Specifications",
      description: "Master specifications, distributed node DAGs, and multi-agent RAG blueprints",
      color: "blue",
      documentCount: 4,
      createdAt: "2026-01-15T00:00:00Z"
    },
    {
      id: "col_security_02",
      workspaceId: "ws_default_01",
      name: "Security & SOC-2 Compliance",
      description: "RLS isolation policies, encryption standards, and threat prevention logs",
      color: "cyan",
      documentCount: 2,
      createdAt: "2026-02-01T00:00:00Z"
    }
  ];

  public static getInstance(): CollectionRepository {
    if (!CollectionRepository.instance) {
      CollectionRepository.instance = new CollectionRepository();
    }
    return CollectionRepository.instance;
  }

  async getCollections(workspaceId: string): Promise<KnowledgeCollectionItem[]> {
    return this.mockCollections.filter((c) => c.workspaceId === workspaceId);
  }

  async createCollection(workspaceId: string, name: string, description: string, color = "blue"): Promise<KnowledgeCollectionItem> {
    const col: KnowledgeCollectionItem = {
      id: `col_${Date.now()}`,
      workspaceId,
      name,
      description,
      color,
      documentCount: 0,
      createdAt: new Date().toISOString()
    };
    this.mockCollections.push(col);
    return col;
  }
}

export const collectionRepository = CollectionRepository.getInstance();
