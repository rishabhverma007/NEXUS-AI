import { governanceRepository } from "@/repositories/governance-repository";

export class GovernanceEngine {
  static async getOrganizationDetails(orgId: string) {
    const org = await governanceRepository.getOrganization(orgId);
    const departments = await governanceRepository.getDepartments(orgId);
    const teams = await governanceRepository.getTeams(orgId);
    const projects = await governanceRepository.getProjects(orgId);

    return {
      organization: org,
      departments,
      teams,
      projects,
      totalDepartments: departments.length,
      totalTeams: teams.length,
      totalProjects: projects.length,
    };
  }
}
