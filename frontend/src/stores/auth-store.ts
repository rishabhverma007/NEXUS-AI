"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/nexus";
import {
  clearAuthSession,
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  setAuthSession,
} from "@/lib/api";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  workspaceId: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

/**
 * Auth store. The token + user are persisted to localStorage (via the persist
 * middleware) so a page reload restores the session immediately; the token is
 * validated against /auth/me by `restoreSession` (dashboard guard).
 *
 * Security note: localStorage tokens are readable by any script on the page
 * (XSS-exposed). This is an accepted tradeoff for the SPA demo; a hardened
 * deployment should move the token to an HttpOnly Secure cookie instead.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      workspaceId: null,
      status: "idle",

      login: async (email, password) => {
        const session = await apiLogin(email, password);
        setAuthSession(session.access_token, session.workspace_id);
        set({
          user: session.user,
          token: session.access_token,
          workspaceId: session.workspace_id,
          status: "authenticated",
        });
      },

      register: async (fullName, email, password) => {
        const session = await apiRegister(fullName, email, password);
        setAuthSession(session.access_token, session.workspace_id);
        set({
          user: session.user,
          token: session.access_token,
          workspaceId: session.workspace_id,
          status: "authenticated",
        });
      },

      logout: () => {
        clearAuthSession();
        set({ user: null, token: null, workspaceId: null, status: "unauthenticated" });
      },

      restoreSession: async () => {
        const { token, status } = get();
        if (!token) {
          set({ status: "unauthenticated" });
          return;
        }
        if (status === "authenticated") return;
        set({ status: "loading" });
        try {
          const me = await fetchMe();
          set({ user: me, status: "authenticated" });
        } catch (err) {
          const statusCode = (err as { status?: number }).status;
          if (statusCode === 401) {
            // Token invalid/expired — hard sign-out.
            clearAuthSession();
            set({ user: null, token: null, workspaceId: null, status: "unauthenticated" });
          } else {
            // Backend unreachable — keep the stored session so the app still
            // renders offline; the AI status badge surfaces connectivity.
            set({ status: "authenticated" });
          }
        }
      },
    }),
    {
      name: "nexus-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        workspaceId: state.workspaceId,
      }),
    }
  )
);
