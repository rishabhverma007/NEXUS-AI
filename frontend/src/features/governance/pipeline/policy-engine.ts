import { governanceRepository, GovernancePolicy } from "@/repositories/governance-repository";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export class PolicyEngine {
  static async evaluatePolicy(orgId: string, policyType: GovernancePolicy["policyType"]): Promise<{ passed: boolean; policy?: GovernancePolicy }> {
    const policies = await governanceRepository.getPolicies(orgId);
    const targetPolicy = policies.find((p) => p.policyType === policyType && p.isEnforced);

    if (targetPolicy && targetPolicy.approvalRequired) {
      return { passed: false, policy: targetPolicy };
    }

    return { passed: true, policy: targetPolicy };
  }

  static async createPolicy(orgId: string, name: string, policyType: GovernancePolicy["policyType"], description: string, rules: Record<string, any>, approvalRequired: boolean): Promise<GovernancePolicy> {
    const policy = await governanceRepository.createPolicy({
      orgId,
      name,
      policyType,
      description,
      isEnforced: true,
      rules,
      approvalRequired,
    });

    runtimeEventBus.publish("POLICY_CREATED", { orgId, policyId: policy.id, name, policyType });
    return policy;
  }
}
