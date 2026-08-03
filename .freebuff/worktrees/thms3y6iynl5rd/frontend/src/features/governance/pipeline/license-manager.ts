import { governanceRepository, LicenseItem, QuotaItem } from "@/repositories/governance-repository";

export class LicenseManager {
  static async getLicenseDetails(orgId: string): Promise<LicenseItem> {
    return governanceRepository.getLicense(orgId);
  }

  static async getQuotaStatus(workspaceId: string): Promise<QuotaItem> {
    return governanceRepository.getQuota(workspaceId);
  }
}
