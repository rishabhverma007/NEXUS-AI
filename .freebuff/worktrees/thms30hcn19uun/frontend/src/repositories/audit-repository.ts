export interface AuditLogEntry {
  id: string;
  actor: string;
  eventType: string;
  workspaceName: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export class AuditRepository {
  private static instance: AuditRepository;

  private mockLogs: AuditLogEntry[] = [
    {
      id: "log_01",
      actor: "Principal Architect (architect@nexus.ai)",
      eventType: "USER_LOGIN_SUCCESS",
      workspaceName: "Nexus Enterprise Core",
      timestamp: "2026-07-23 06:45:10",
      metadata: { authProvider: "Supabase JWT", ip: "192.168.1.100" }
    },
    {
      id: "log_02",
      actor: "Principal Architect (architect@nexus.ai)",
      eventType: "THEME_CHANGED",
      workspaceName: "Nexus Enterprise Core",
      timestamp: "2026-07-23 06:50:22",
      metadata: { theme: "Obsidian Deep", previous: "Midnight" }
    },
    {
      id: "log_03",
      actor: "Lead Systems Engineer (lead@nexus.ai)",
      eventType: "DOCUMENT_INGESTED",
      workspaceName: "Nexus Enterprise Core",
      timestamp: "2026-07-23 07:02:15",
      metadata: { docTitle: "Master Architecture Blueprint", chunks: 12 }
    }
  ];

  public static getInstance(): AuditRepository {
    if (!AuditRepository.instance) {
      AuditRepository.instance = new AuditRepository();
    }
    return AuditRepository.instance;
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return this.mockLogs;
  }

  async logEvent(eventType: string, workspaceName: string, metadata: Record<string, any> = {}): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      actor: "Principal Architect (architect@nexus.ai)",
      eventType,
      workspaceName,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      metadata
    };
    this.mockLogs.unshift(entry);
    return entry;
  }
}

export const auditRepository = AuditRepository.getInstance();
