"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { useNexusStore } from "@/stores/nexus-store";
import { Activity, Cpu, Database, Palette, Wifi } from "lucide-react";

export function StatusBar() {
  const { theme } = useTheme();
  const { currentWorkspace, selectedModel } = useNexusStore();

  return (
    <footer className="h-7 border-t border-white/5 bg-[#05070A]/90 text-[10px] text-slate-400 px-4 flex items-center justify-between font-mono z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-semibold">CONNECTED</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <Database className="h-3 w-3 text-cyan-400" />
          <span>{currentWorkspace.name}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-nexus-400" />
          <span>{selectedModel}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-amber-400" />
          <span>Mem: 42MB | Tokens: 12.4k</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Palette className="h-3 w-3 text-pink-400" />
          <span>{theme.name}</span>
        </div>
      </div>
    </footer>
  );
}
