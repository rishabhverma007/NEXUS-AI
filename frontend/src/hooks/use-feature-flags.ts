"use client";

import { useState } from "react";
import { DEFAULT_FEATURE_FLAGS, FeatureFlag } from "@/config/feature-flags";

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>(DEFAULT_FEATURE_FLAGS);

  const isEnabled = (key: string): boolean => {
    return flags[key]?.enabled ?? true;
  };

  const toggleFlag = (key: string) => {
    setFlags((prev) => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], enabled: !prev[key].enabled },
      };
    });
  };

  return {
    flags: Object.values(flags),
    isEnabled,
    toggleFlag,
  };
}
