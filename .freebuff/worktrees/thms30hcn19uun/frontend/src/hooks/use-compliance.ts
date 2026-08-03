"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { ComplianceReportItem } from "@/repositories/governance-repository";

export function useCompliance(orgId = "org_default") {
  const [reports, setReports] = useState<ComplianceReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompliance = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await aiRuntime.governance.compliance(orgId);
      setReports(data);
    } catch (err) {
      console.error("[useCompliance] Failed to fetch compliance reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  return {
    reports,
    isLoading,
    refresh: fetchCompliance,
  };
}
