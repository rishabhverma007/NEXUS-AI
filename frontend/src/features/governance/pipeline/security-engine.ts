import { governanceRepository, SecurityEventLog } from "@/repositories/governance-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class SecurityEngine {
  static async listSecurityEvents(orgId: string): Promise<any[]> {
    return governanceRepository.getSecurityEvents(orgId);
  }

  static async validateSessionSecurity(ipAddress: string, country?: string): Promise<{ secure: boolean; warning?: string }> {
    const isTorExit = ipAddress.startsWith("185.220");
    if (isTorExit) {
      runtimeEventBus.publish("SECURITY_ALERT", {
        eventType: "ANONYMOUS_IP_BLOCKED",
        severity: "high",
        ipAddress,
        country,
      });
      return { secure: false, warning: "Anonymous / TOR exit node IP detected and blocked." };
    }
    return { secure: true };
  }
}
