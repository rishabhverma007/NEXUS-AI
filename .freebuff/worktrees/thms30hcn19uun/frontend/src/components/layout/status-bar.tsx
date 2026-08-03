"use client";

import { useTheme } from "@/providers/theme-provider";
import { useNexusStore } from "@/stores/nexus-store";
import { Activity, Cpu, Database, Palette, Wifi } from "lucide-react";

export function StatusBar() {
  const { theme } = useTheme();
  const { currentWorkspace, selectedModel } = useNexusStore();

  return (
    <footer className="h-7 border-t border-slate-800/80 bg-slate-950/90 text-[10px] text-slate-400 px-4 flex items-center justify-between font-mono z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Wifi className="h-3 w-3" />
          <span>CONNECTED (8ms)</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <Database className="h-3 w-3 text-cyan-400" />
          <span>{currentWorkspace.name}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-300">
          <Cpu className="h-3 w-3 text-indigo-400" />
          <span>{selectedModel}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-amber-400" />
          <span>Mem: 42MB | Tokens: 12.4k</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-200">
          <Palette className="h-3 w-3 text-pink-400" />
          <span>Theme: {theme.name}</span>
        </div>
      </div>
    </footer>
  );
}
