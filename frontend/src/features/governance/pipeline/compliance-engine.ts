import { governanceRepository, ComplianceReportItem } from "@/repositories/governance-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class ComplianceEngine {
  static async getComplianceStatus(orgId: string): Promise<ComplianceReportItem[]> {
    return governanceRepository.getComplianceReports(orgId);
  }

  static async generateComplianceSnapshot(orgId: string): Promise<ComplianceReportItem[]> {
    const reports = await governanceRepository.getComplianceReports(orgId);
    runtimeEventBus.publish("COMPLIANCE_REPORT_GENERATED", {
      orgId,
      reportsCount: reports.length,
    });
    return reports;
  }
}
