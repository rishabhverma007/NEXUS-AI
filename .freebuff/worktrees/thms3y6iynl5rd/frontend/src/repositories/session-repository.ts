export interface UserSessionItem {
  id: string;
  browser: string;
  os: string;
  ipAddress: string;
  country: string;
  isCurrent: boolean;
  lastActiveAt: string;
}

export class SessionRepository {
  private static instance: SessionRepository;

  private mockSessions: UserSessionItem[] = [
    {
      id: "sess_current",
      browser: "Chrome 125.0",
      os: "Windows 11 Enterprise",
      ipAddress: "192.168.1.100",
      country: "United States (US)",
      isCurrent: true,
      lastActiveAt: "Active Now"
    },
    {
      id: "sess_mobile",
      browser: "Safari Mobile 18.2",
      os: "iOS 18.2",
      ipAddress: "172.56.21.4",
      country: "United States (US)",
      isCurrent: false,
      lastActiveAt: "2 hours ago"
    }
  ];

  public static getInstance(): SessionRepository {
    if (!SessionRepository.instance) {
      SessionRepository.instance = new SessionRepository();
    }
    return SessionRepository.instance;
  }

  async getActiveSessions(): Promise<UserSessionItem[]> {
    return this.mockSessions;
  }

  async revokeSession(id: string): Promise<boolean> {
    this.mockSessions = this.mockSessions.filter((s) => s.id !== id);
    return true;
  }

  async revokeAllOtherSessions(): Promise<boolean> {
    this.mockSessions = this.mockSessions.filter((s) => s.isCurrent);
    return true;
  }
}

export const sessionRepository = SessionRepository.getInstance();
