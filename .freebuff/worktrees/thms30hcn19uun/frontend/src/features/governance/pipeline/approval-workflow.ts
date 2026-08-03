import { governanceRepository, ApprovalRequest } from "@/repositories/governance-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class ApprovalWorkflow {
  static async listApprovals(orgId: string): Promise<ApprovalRequest[]> {
    return governanceRepository.getApprovals(orgId);
  }

  static async grantApproval(id: string, reason?: string): Promise<void> {
    await governanceRepository.updateApprovalStatus(id, "approved", reason);
    runtimeEventBus.publish("APPROVAL_GRANTED", { approvalId: id, reason });
  }

  static async rejectApproval(id: string, reason?: string): Promise<void> {
    await governanceRepository.updateApprovalStatus(id, "rejected", reason);
    runtimeEventBus.publish("APPROVAL_REJECTED", { approvalId: id, reason });
  }
}
