"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { DepartmentItem, OrganizationItem, ProjectItem, TeamItem } from "@/repositories/governance-repository";

export function useOrganizations(orgId = "org_default") {
  const [orgDetails, setOrgDetails] = useState<{
    organization?: OrganizationItem;
    departments: DepartmentItem[];
    teams: TeamItem[];
    projects: ProjectItem[];
  }>({ departments: [], teams: [], projects: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrgDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.governance.organizations(orgId);
      setOrgDetails(data);
    } catch (err) {
      console.error("[useOrganizations] Failed to fetch organization details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrgDetails();
  }, [fetchOrgDetails]);

  return {
    orgDetails,
    isLoading,
    refresh: fetchOrgDetails,
  };
}
