"use client";

import { useState } from "react";
import { useDocuments } from "@/hooks/use-documents";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AsyncUploaderProps {
  onClose: () => void;
  collectionId?: string;
}

export function AsyncUploader({ onClose, collectionId }: AsyncUploaderProps) {
  const { createDocument } = useDocuments(collectionId);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [stage, setStage] = useState<string | null>(null);

  const handleSimulateUpload = async () => {
    if (!fileName) return;
    setIsUploading(true);
    setStage("Checksum Verification & Duplicate Check");
    await new Promise((r) => setTimeout(r, 600));

    setStage("Parsing Structure (MarkdownParser)");
    await new Promise((r) => setTimeout(r, 600));

    setStage("Extracting Metadata & Language Confidence");
    await new Promise((r) => setTimeout(r, 600));

    setStage("Preparing Structural Chunks (Token Estimates)");
    await new Promise((r) => setTimeout(r, 600));

    const ext = fileName.split(".").pop() || "markdown";
    await createDocument({
      title: fileName.replace(/\.[^/.]+$/, ""),
      sourceType: ext,
      fileSizeBytes: 24500,
    });

    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-nexus-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg nexus-glass p-6 rounded-3xl border border-nexus-border space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-nexus-accent" />
            <h2 className="text-sm font-bold text-nexus-50">Enterprise File Ingestion Pipeline</h2>
          </div>
          <button onClick={onClose} className="text-nexus-400 hover:text-nexus-200 p-1 rounded hover:bg-nexus-850">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isUploading ? (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 text-nexus-accent animate-spin mx-auto" />
            <div className="text-sm font-bold text-nexus-50">{stage}</div>
            <p className="text-xs text-nexus-400 font-mono">
              Emitting runtime events to Global Event Bus...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-nexus-border rounded-2xl text-center space-y-3 bg-nexus-950/40">
              <FileText className="h-8 w-8 text-nexus-500 mx-auto" />
              <div className="text-xs text-nexus-300">
                Drag and drop PDF, DOCX, Markdown, CSV, HTML, or JSON files
              </div>
              <input
                type="text"
                placeholder="Enter file name (e.g. System_Blueprint.md)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-nexus-850 border border-nexus-border rounded-xl px-3 py-2 text-xs text-nexus-50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" className="w-full" onClick={handleSimulateUpload}>
                Start Ingestion
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
