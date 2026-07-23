"use client";

import { useState } from "react";
import { useHybridSearch } from "@/hooks/use-hybrid-search";
import { ResultCard } from "./result-card";
import { SearchInspector } from "./search-inspector";
import { FinalRetrievalChunk } from "../pipeline/hybrid-engine";
import { Clock, Filter, Layers, Network, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function RetrievalDashboard() {
  const [query, setQuery] = useState("Explain multi-agent RAG graph traversal");
  const [mode, setMode] = useState<"fast" | "balanced" | "deep" | "research">("balanced");
  const { result, isSearching, executeSearch } = useHybridSearch();
  const [inspectedChunk, setInspectedChunk] = useState<FinalRetrievalChunk | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, mode);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#030712]">
      {/* Top Search Toolbar */}
      <div className="p-6 border-b border-nexus-border/80 bg-nexus-950/80 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
              <Network className="h-6 w-6 text-nexus-accent" />
              Enterprise Hybrid Retrieval Engine
            </h1>
            <p className="text-xs text-nexus-400 mt-0.5">
              BM25 Sparse + pgvector Cosine + RRF Fusion + Reranker + Explainability Engine
            </p>
          </div>

          <div className="flex items-center gap-2 bg-nexus-850/80 p-1 rounded-xl border border-nexus-border text-xs font-mono">
            {(["fast", "balanced", "deep", "research"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  mode === m
                    ? "bg-nexus-accent/30 text-nexus-accent border border-nexus-accent/40 font-bold"
                    : "text-nexus-400 hover:text-nexus-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-nexus-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all ingested enterprise documents..."
              className="pl-9 text-xs"
              required
            />
          </div>
          <Button variant="primary" size="sm" type="submit" isLoading={isSearching} className="gap-2">
            <Zap className="h-4 w-4" />
            <span>Search Knowledge</span>
          </Button>
        </form>
      </div>

      {/* Results & Inspector Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-nexus-400 pb-2 border-b border-nexus-border/60">
                <div className="flex items-center gap-2">
                  <span>Intent: <strong className="text-nexus-200 uppercase">{result.analyzedQuery.intent}</strong></span>
                  <span>•</span>
                  <span>Rewritten: <strong className="text-nexus-accent">"{result.rewrittenQuery}"</strong></span>
                </div>
                <span>Execution: <strong className="text-nexus-emerald">{result.durationMs} ms</strong></span>
              </div>

              <div className="space-y-4">
                {result.chunks.map((chunk) => (
                  <ResultCard key={chunk.chunkId} chunk={chunk} onExplainClick={setInspectedChunk} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <Search className="h-10 w-10 text-nexus-600 mx-auto" />
              <h3 className="text-sm font-semibold text-nexus-300">Ready to execute Hybrid Retrieval</h3>
              <p className="text-xs text-nexus-500">Enter a query above to inspect BM25, Vector, RRF, and Rerank scores.</p>
            </div>
          )}
        </div>

        {inspectedChunk && (
          <SearchInspector chunk={inspectedChunk} onClose={() => setInspectedChunk(null)} />
        )}
      </div>
    </div>
  );
}
