"use client";

import { useState } from "react";
import { useMemory } from "@/hooks/use-memory";
import { MemoryHealthCard } from "./memory-health-card";
import { MemoryTimeline } from "./memory-timeline";
import { MemoryInspector } from "./memory-inspector";
import { MemoryObjectItem } from "@/repositories/memory-repository";
import { Brain, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemoryDashboard() {
  const { memories, saveMemory } = useMemory();
  const [selectedMemory, setSelectedMemory] = useState<MemoryObjectItem | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6 text-cyan-400" />
            Enterprise Long-Term Memory Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hierarchical memory stores (Working, Episodic, Semantic, Workspace) integrated directly into AI Runtime SDK.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() =>
            saveMemory({
              key: "user_workspace_preference",
              value: "Enterprise RLS workspace isolation enabled for all AI entities",
              type: "semantic",
              category: "preference",
            })
          }
        >
          <Plus className="h-4 w-4" />
          <span>Remember Fact</span>
        </Button>
      </div>

      <MemoryHealthCard />

      <div className="flex gap-6">
        <div className="flex-1">
          <MemoryTimeline
            memories={memories}
            selectedMemory={selectedMemory}
            onSelectMemory={setSelectedMemory}
          />
        </div>

        {selectedMemory && (
          <MemoryInspector memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
        )}
      </div>
    </div>
  );
}
