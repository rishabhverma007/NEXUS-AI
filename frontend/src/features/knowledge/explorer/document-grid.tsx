"use client";

import { DocumentItem } from "@/repositories/document-repository";
import { FileText, Eye, Info, LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentGridProps {
  documents: DocumentItem[];
  selectedDocument: DocumentItem | null;
  onSelectDocument: (doc: DocumentItem) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function DocumentGrid({
  documents,
  selectedDocument,
  onSelectDocument,
  onPreviewDocument,
  viewMode,
  onViewModeChange,
}: DocumentGridProps) {
  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-nexus-400">
          Showing {documents.length} Enterprise Documents
        </span>

        <div className="flex items-center gap-1 bg-nexus-850/80 p-1 rounded-lg border border-nexus-border">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-nexus-800 text-nexus-accent" : "text-nexus-500 hover:text-nexus-300"}`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-nexus-800 text-nexus-accent" : "text-nexus-500 hover:text-nexus-300"}`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isSelected = selectedDocument?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className={`nexus-glass p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "border-cyan-500/60 bg-nexus-accent/10 shadow-glow"
                    : "border-nexus-border/80 hover:border-nexus-border bg-nexus-950/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" className="uppercase text-[10px]">
                    {doc.sourceType}
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewDocument(doc);
                    }}
                    className="p-1 rounded hover:bg-nexus-800 text-nexus-400 hover:text-nexus-200"
                    title="Preview Document"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="font-semibold text-sm text-nexus-50 line-clamp-2">{doc.title}</h3>

                <div className="flex items-center justify-between text-[10px] text-nexus-400 font-mono pt-2 border-t border-nexus-border/60">
                  <span>Version V{doc.currentVersion}</span>
                  <span>{doc.createdAt.substring(0, 10)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="p-4 rounded-xl bg-nexus-850/60 border border-nexus-border flex items-center justify-between text-xs cursor-pointer hover:border-nexus-border"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-nexus-accent" />
                <span className="font-semibold text-nexus-50">{doc.title}</span>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="cyan" className="uppercase text-[10px]">
                  {doc.sourceType}
                </Badge>
                <span className="text-nexus-400 font-mono text-[10px]">V{doc.currentVersion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
