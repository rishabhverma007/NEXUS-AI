"use client";

import { DocumentItem } from "@/repositories/document-repository";
import { CheckCircle2, Clock, FileText, Layers, ShieldCheck, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentInspectorProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentInspector({ document, onClose }: DocumentInspectorProps) {
  if (!document) return null;

  const timelineSteps = [
    { name: "Uploaded", time: "10:00:01", status: "completed" },
    { name: "Checksum Verified", time: "10:00:02", status: "completed" },
    { name: "Parsed (MarkdownParser)", time: "10:00:03", status: "completed" },
    { name: "Metadata Extracted", time: "10:00:04", status: "completed" },
    { name: "Chunks Prepared (12 Chunks)", time: "10:00:05", status: "completed" },
  ];

  return (
    <aside className="w-80 h-full border-l border-nexus-border/80 bg-nexus-950/95 nexus-glass p-5 overflow-y-auto z-20 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-nexus-accent" />
          <h3 className="text-xs font-semibold text-nexus-50 uppercase tracking-wider">
            Document Inspector
          </h3>
        </div>
        <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Overview Card */}
      <div className="p-4 rounded-2xl bg-nexus-850/60 border border-nexus-border space-y-2">
        <Badge variant="cyan" className="uppercase">{document.sourceType}</Badge>
        <h2 className="text-sm font-bold text-nexus-50">{document.title}</h2>
        <div className="text-[10px] text-nexus-400 font-mono">
          Author: {document.author} • Version V{document.currentVersion}
        </div>
      </div>

      {/* Metadata Attributes */}
      <div className="space-y-2 text-xs">
        <h4 className="text-[11px] font-semibold text-nexus-400 uppercase tracking-wider">Extracted Metadata</h4>
        <div className="p-3 rounded-xl bg-nexus-850/40 border border-nexus-border/60 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-nexus-400">File Size:</span>
            <span className="text-nexus-200">{document.fileSizeBytes} Bytes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Language Confidence:</span>
            <span className="text-nexus-emerald">English (99.8%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Word Count:</span>
            <span className="text-nexus-200">1,240 Words</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Reading Time:</span>
            <span className="text-nexus-200">3 Minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-400">Checksum (SHA256):</span>
            <span className="text-nexus-accent truncate max-w-[120px]">{document.checksumSha256}</span>
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-2 text-xs">
        <h4 className="text-[11px] font-semibold text-nexus-400 uppercase tracking-wider">Processing Timeline</h4>
        <div className="space-y-2 pl-2 border-l border-nexus-border">
          {timelineSteps.map((step) => (
            <div key={step.name} className="relative pl-4 space-y-0.5">
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-emerald-400" />
              <div className="font-semibold text-nexus-200 text-[11px]">{step.name}</div>
              <div className="text-[9px] text-nexus-500 font-mono">{step.time}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
