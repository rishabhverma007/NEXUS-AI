export interface DocumentItem {
  id: string;
  workspaceId: string;
  collectionId?: string;
  folderId?: string;
  title: string;
  sourceType: string;
  mimeType: string;
  currentVersion: number;
  status: "queued" | "parsing" | "ocr" | "completed" | "failed";
  fileSizeBytes: number;
  checksumSha256: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreparedChunkItem {
  id: string;
  documentId: string;
  chunkOrder: number;
  content: string;
  estimatedTokenCount: number;
  heading?: string;
  pageNumber: number;
}

export class DocumentRepository {
  private static instance: DocumentRepository;

  private mockDocuments: DocumentItem[] = [
    {
      id: "doc_master_blueprint",
      workspaceId: "ws_default_01",
      collectionId: "col_arch_01",
      title: "NEXUS AI Master Architecture Blueprint",
      sourceType: "markdown",
      mimeType: "text/markdown",
      currentVersion: 2,
      status: "completed",
      fileSizeBytes: 14250,
      checksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      author: "Principal Architect",
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: "2026-07-23T06:00:00Z"
    },
    {
      id: "doc_graphrag_spec",
      workspaceId: "ws_default_01",
      collectionId: "col_arch_01",
      title: "GraphRAG Subgraph Traversal Specification",
      sourceType: "pdf",
      mimeType: "application/pdf",
      currentVersion: 1,
      status: "completed",
      fileSizeBytes: 89400,
      checksumSha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      author: "Senior AI Research Engineer",
      createdAt: "2026-02-10T00:00:00Z",
      updatedAt: "2026-02-10T00:00:00Z"
    }
  ];

  public static getInstance(): DocumentRepository {
    if (!DocumentRepository.instance) {
      DocumentRepository.instance = new DocumentRepository();
    }
    return DocumentRepository.instance;
  }

  async getDocuments(workspaceId: string, collectionId?: string): Promise<DocumentItem[]> {
    let docs = this.mockDocuments.filter((d) => d.workspaceId === workspaceId);
    if (collectionId) {
      docs = docs.filter((d) => d.collectionId === collectionId);
    }
    return docs;
  }

  async getDocumentById(id: string): Promise<DocumentItem | null> {
    return this.mockDocuments.find((d) => d.id === id) || null;
  }

  async createDocument(
    workspaceId: string,
    title: string,
    sourceType: string,
    fileSizeBytes: number,
    collectionId?: string
  ): Promise<DocumentItem> {
    const doc: DocumentItem = {
      id: `doc_${Date.now()}`,
      workspaceId,
      collectionId,
      title,
      sourceType,
      mimeType: sourceType === "pdf" ? "application/pdf" : "text/markdown",
      currentVersion: 1,
      status: "completed",
      fileSizeBytes,
      checksumSha256: `sha256_${Math.random().toString(36).substring(2)}`,
      author: "Principal Architect",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockDocuments.unshift(doc);
    return doc;
  }
}

export const documentRepository = DocumentRepository.getInstance();
