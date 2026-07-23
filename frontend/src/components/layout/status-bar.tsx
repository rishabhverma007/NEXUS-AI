"use client";

import { useTheme } from "@/providers/theme-provider";
import { useNexusStore } from "@/stores/nexus-store";
import { Activity, Cpu, Database, Palette, Wifi } from "lucide-react";

export function StatusBar() {
  const { theme } = useTheme();
  const { currentWorkspace, selectedModel } = useNexusStore();

  return (
    <footer className="h-7 border-t border-nexus-border bg-nexus-950/90 backdrop-blur-xl text-[10px] text-nexus-400 px-4 flex items-center justify-between font-mono z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-nexus-emerald">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-nexus-emerald" />
          </span>
          <span>CONNECTED (8ms)</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-nexus-300">
          <Database className="h-3 w-3 text-nexus-accent" />
          <span>{currentWorkspace.name}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-nexus-300">
          <Cpu className="h-3 w-3 text-nexus-brand-light" />
          <span>{selectedModel}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-nexus-amber" />
          <span>Mem: 42MB | Tokens: 12.4k</span>
        </div>

        <div className="flex items-center gap-1.5 text-nexus-300">
          <Palette className="h-3 w-3 text-pink-400" />
          <span>{theme.name}</span>
        </div>
      </div>
    </footer>
  );
}
