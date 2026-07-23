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
    <aside className="w-80 h-full border-l border-slate-800/80 bg-slate-950/95 glass-panel p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
            Retrieval Explainability
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-900">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 font-mono block">Document Source</span>
          <span className="font-bold text-slate-100">{chunk.documentTitle}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 font-mono block">Matched Query Terms</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {chunk.explanation.matchedKeywords.map((kw) => (
              <Badge key={kw} variant="cyan">{kw}</Badge>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Explanation Summary</span>
          <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
            {chunk.explanation.explanationSummary}
          </p>
        </div>

        <div className="space-y-2 font-mono text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-900">
          <div className="flex justify-between">
            <span className="text-slate-400">BM25 Rank Score:</span>
            <span className="text-slate-200">{chunk.bm25Score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vector Cosine Score:</span>
            <span className="text-indigo-400">{(chunk.vectorScore * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">RRF Fusion Score:</span>
            <span className="text-amber-400">{chunk.rrfScore}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-slate-800 pt-1">
            <span className="text-emerald-400">Reranked Final Score:</span>
            <span className="text-emerald-400">{chunk.rerankScore}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
