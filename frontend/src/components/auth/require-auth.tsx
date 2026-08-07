"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

function SessionLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin" />
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Authenticating session…
        </p>
      </div>
    </div>
  );
}

/**
 * Client-side gate for the dashboard area. Validates the persisted token
 * against /auth/me on mount and redirects to /login when there is no valid
 * session. Renders children only after the session is confirmed.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, status, restoreSession } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    restoreSession().finally(() => {
      if (!cancelled) setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [restoreSession]);

  useEffect(() => {
    // Redirect on explicit unauthenticated OR a missing token (covers the
    // logout-during-restore race where status may lag behind token=null).
    if (checked && (!token || status === "unauthenticated")) {
      router.replace("/login");
    }
  }, [checked, status, token, router]);

  if (!checked || status === "loading") return <SessionLoader />;
  if (!token || status === "unauthenticated") return null;
  return <>{children}</>;
}
