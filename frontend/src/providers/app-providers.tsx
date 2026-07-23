"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { NotificationProvider } from "./notification-provider";
import { ShortcutProvider } from "./shortcut-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <ShortcutProvider>
            {children}
          </ShortcutProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
