"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  /* ── State ── */
  user: UserProfile | null;
  accessToken: string | null;
  workspaceId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /* ── Actions ── */
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      /* ── Initial state ── */
      user: null,
      accessToken: null,
      workspaceId: "ws_default_01",
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /* ── Sign Up ── */
      signUp: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name: fullName }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ isLoading: false, error: data.detail || "Registration failed. Please try again." });
            return;
          }

          set({
            user: data.user,
            accessToken: data.access_token,
            workspaceId: data.workspace_id,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({ isLoading: false, error: "Network error. Please check your connection and try again." });
        }
      },

      /* ── Sign In ── */
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ isLoading: false, error: data.detail || "Authentication failed. Please try again." });
            return;
          }

          set({
            user: data.user,
            accessToken: data.access_token,
            workspaceId: data.workspace_id,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({ isLoading: false, error: "Network error. Please check your connection and try again." });
        }
      },

      /* ── Sign Out ── */
      signOut: () => {
        set({
          user: null,
          accessToken: null,
          workspaceId: "ws_default_01",
          isAuthenticated: false,
          error: null,
        });
      },

      /* ── Fetch Profile ── */
      fetchProfile: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!res.ok) {
            // Token expired or invalid → sign out
            if (res.status === 401 || res.status === 403) {
              get().signOut();
            }
            return;
          }

          const user: UserProfile = await res.json();
          set({ user, isAuthenticated: true });
        } catch {
          // Silently fail — network might be down
        }
      },

      /* ── Clear Error ── */
      clearError: () => set({ error: null }),
    }),
    {
      name: "nexus-auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        workspaceId: state.workspaceId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
