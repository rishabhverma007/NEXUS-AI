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
        <span className="text-xs font-mono text-slate-400">
          Showing {documents.length} Enterprise Documents
        </span>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
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
                className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "border-cyan-500/60 bg-blue-600/10 shadow-glow"
                    : "border-slate-800/80 hover:border-slate-700 bg-slate-950/60"
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
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    title="Preview Document"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="font-semibold text-sm text-slate-100 line-clamp-2">{doc.title}</h3>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
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
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-slate-100">{doc.title}</span>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="cyan" className="uppercase text-[10px]">
                  {doc.sourceType}
                </Badge>
                <span className="text-slate-400 font-mono text-[10px]">V{doc.currentVersion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
