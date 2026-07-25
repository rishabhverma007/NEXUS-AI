"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth";

/** Public routes that don't require authentication */
const PUBLIC_ROUTES = [
  "/",           // Landing page
  "/login",      // Sign in
  "/signup",     // Sign up
  "/onboarding", // Onboarding wizard
  "/_not-found", // 404
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, accessToken, fetchProfile } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Validate stored token by fetching user profile
      if (accessToken && !isAuthenticated) {
        await fetchProfile();
      }

      // Check auth state and redirect if needed
      if (cancelled) return;
      const state = useAuthStore.getState();
      if (!state.isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
        router.push("/login");
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  // Don't render protected content on public routes (avoids flash)
  // But still allow children to render — the redirect will happen via useEffect
  return <>{children}</>;
}
