export interface APIKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  expiresAt: string;
  createdAt: string;
}

export class APIKeyRepository {
  private static instance: APIKeyRepository;

  private mockKeys: APIKeyItem[] = [
    {
      id: "key_01",
      name: "CI/CD Agent Deployment Key",
      keyPrefix: "nx_live_9f82...",
      scopes: ["rag:read", "graph:read", "agent:execute"],
      expiresAt: "2027-01-01",
      createdAt: "2026-01-10"
    }
  ];

  public static getInstance(): APIKeyRepository {
    if (!APIKeyRepository.instance) {
      APIKeyRepository.instance = new APIKeyRepository();
    }
    return APIKeyRepository.instance;
  }

  async getAPIKeys(): Promise<APIKeyItem[]> {
    return this.mockKeys;
  }

  async generateAPIKey(name: string, scopes: string[]): Promise<{ key: APIKeyItem; secret: string }> {
    const rawSecret = `nx_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const prefix = `${rawSecret.substring(0, 12)}...`;
    const item: APIKeyItem = {
      id: `key_${Date.now()}`,
      name,
      keyPrefix: prefix,
      scopes,
      expiresAt: "Never",
      createdAt: new Date().toISOString().substring(0, 10)
    };
    this.mockKeys.push(item);
    return { key: item, secret: rawSecret };
  }

  async revokeAPIKey(id: string): Promise<boolean> {
    this.mockKeys = this.mockKeys.filter((k) => k.id !== id);
    return true;
  }
}

export const apiKeyRepository = APIKeyRepository.getInstance();
