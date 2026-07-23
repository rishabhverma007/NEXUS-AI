"use client";

import { FinalRetrievalChunk } from "../pipeline/hybrid-engine";
import { FileText, HelpCircle, Layers, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  chunk: FinalRetrievalChunk;
  onExplainClick: (chunk: FinalRetrievalChunk) => void;
}

export function ResultCard({ chunk, onExplainClick }: ResultCardProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-sm text-slate-100">{chunk.documentTitle}</span>
          <span className="text-[10px] font-mono text-slate-500">• Page {chunk.pageNumber}</span>
        </div>

        <button
          onClick={() => onExplainClick(chunk)}
          className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 bg-blue-600/10 px-2 py-1 rounded-md border border-blue-500/30"
        >
          <HelpCircle className="h-3 w-3" />
          <span>Why Retrieved?</span>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 font-mono text-xs text-slate-300">
        "{chunk.content}"
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">BM25: {chunk.bm25Score}</Badge>
          <Badge variant="emerald">Vector: {(chunk.vectorScore * 100).toFixed(0)}%</Badge>
          <Badge variant="amber">RRF: {chunk.rrfScore}</Badge>
        </div>

        <span className="text-emerald-400 font-bold">Final Score: {chunk.rerankScore}</span>
      </div>
    </div>
  );
}
