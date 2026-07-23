"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { LicenseItem, QuotaItem } from "@/repositories/governance-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useLicenses(orgId = "org_default") {
  const { currentWorkspace } = useNexusStore();
  const [license, setLicense] = useState<LicenseItem | null>(null);
  const [quota, setQuota] = useState<QuotaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLicenseData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [licData, quotData] = await Promise.all([
        aiRuntime.governance.licenses(orgId),
        aiRuntime.governance.quotas(currentWorkspace.id),
      ]);
      setLicense(licData);
      setQuota(quotData);
    } catch (err) {
      console.error("[useLicenses] Failed to fetch license & quota data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, currentWorkspace.id]);

  useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);

  return {
    license,
    quota,
    isLoading,
    refresh: fetchLicenseData,
  };
}
