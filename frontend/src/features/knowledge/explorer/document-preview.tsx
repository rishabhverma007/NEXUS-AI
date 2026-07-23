"use client";

import { DocumentItem } from "@/repositories/document-repository";
import { FileText, Maximize2, X } from "lucide-react";

interface DocumentPreviewProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  if (!document) return null;

  return (
    <div className="flex-1 h-full nexus-glass border border-nexus-border rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-nexus-accent" />
          <h2 className="text-sm font-bold text-nexus-50">{document.title} (Preview)</h2>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto my-4 p-4 rounded-xl bg-nexus-950/80 border border-nexus-border font-mono text-xs text-nexus-300 space-y-4">
        <div className="text-nexus-accent font-bold"># {document.title}</div>
        <p>
          This document was parsed using **MarkdownParser** into structural chunks ready for multi-agent reasoning.
        </p>
        <div className="p-3 rounded-lg bg-nexus-850 border border-nexus-border text-nexus-400">
          <code>
            // Prepared Structural Chunks (Token Estimate: 1,420 tokens)
            <br />
            Chunk #1: Overview & Distributed System Specifications
            <br />
            Chunk #2: Vector RAG & BM25 Hybrid Fusion Pipeline
          </code>
        </div>
      </div>
    </div>
  );
}
