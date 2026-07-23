"use client";

import { FinalRetrievalChunk } from "../pipeline/hybrid-engine";
import { HelpCircle, Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchInspectorProps {
  chunk: FinalRetrievalChunk | null;
  onClose: () => void;
}

export function SearchInspector({ chunk, onClose }: SearchInspectorProps) {
  if (!chunk) return null;

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            Retrieval Explainability
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <span className="text-[10px] text-nexus-500 font-mono block">Document Source</span>
          <span className="font-bold text-nexus-50">{chunk.documentTitle}</span>
        </div>

        <div>
          <span className="text-[10px] text-nexus-500 font-mono block">Matched Query Terms</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {chunk.explanation.matchedKeywords.map((kw) => (
              <Badge key={kw} variant="cyan">{kw}</Badge>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-nexus-850/60 border border-nexus-border space-y-2">
          <span className="text-[10px] text-nexus-400 uppercase font-mono">Explanation Summary</span>
          <p className="text-nexus-300 font-mono text-[11px] leading-relaxed">
            {chunk.explanation.explanationSummary}
          </p>
        </div>

        <div className="space-y-2 font-mono text-[11px] p-3 rounded-xl bg-nexus-950 border border-nexus-border">
          <div className="flex justify-between">
            <span className="text-nexus-400">BM25 Rank Score:</span>
            <span className="text-nexus-200">{chunk.bm25Score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Vector Cosine Score:</span>
            <span className="text-nexus-brand-light">{(chunk.vectorScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">RRF Fusion Score:</span>
            <span className="text-nexus-amber">{chunk.rrfScore}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-nexus-border pt-1">
            <span className="text-nexus-emerald">Reranked Final Score:</span>
            <span className="text-nexus-emerald">{chunk.rerankScore}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
