"use client";

import { useState } from "react";
import { useCollections } from "@/hooks/use-collections";
import { useDocuments } from "@/hooks/use-documents";
import { CollectionTree } from "./collection-tree";
import { DocumentGrid } from "./document-grid";
import { DocumentInspector } from "./document-inspector";
import { DocumentPreview } from "./document-preview";
import { AsyncUploader } from "../uploader/async-uploader";
import { Database, Plus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentItem } from "@/repositories/document-repository";

export function KnowledgeExplorer() {
  const { collections, createCollection } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const { documents } = useDocuments(selectedCollectionId || undefined);

  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploader, setShowUploader] = useState(false);
  const [showCreateColModal, setShowCreateColModal] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName) return;
    await createCollection({ name: newColName, description: newColDesc });
    setNewColName("");
    setNewColDesc("");
    setShowCreateColModal(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-nexus-950">
      {/* Top Knowledge Toolbar */}
      <div className="p-4 border-b border-nexus-border bg-nexus-950/80 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-nexus-brand/10 text-nexus-accent border border-nexus-brand/20 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-nexus-50 tracking-tight">Enterprise Knowledge Platform</h1>
            <p className="text-xs text-nexus-400">Multi-tier ingestion, parsing, structural chunking & versioning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 text-nexus-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Filter document metadata..." className="pl-9 h-9 text-xs" variant="glass" />
          </div>
          <Button variant="primary" size="sm" className="gap-2" onClick={() => setShowUploader(true)}>
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Main Explorer Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <CollectionTree
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          onSelectCollection={setSelectedCollectionId}
          onCreateCollectionClick={() => setShowCreateColModal(true)}
        />

        {previewDocument ? (
          <DocumentPreview document={previewDocument} onClose={() => setPreviewDocument(null)} />
        ) : (
          <DocumentGrid
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
            onPreviewDocument={setPreviewDocument}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

        {selectedDocument && !previewDocument && (
          <DocumentInspector document={selectedDocument} onClose={() => setSelectedDocument(null)} />
        )}
      </div>

      {/* Modals */}
      {showUploader && (
        <AsyncUploader onClose={() => setShowUploader(false)} collectionId={selectedCollectionId || undefined} />
      )}

      {showCreateColModal && (
        <div className="fixed inset-0 bg-nexus-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md nexus-glass-elevated rounded-2xl border border-nexus-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-nexus-50">Create New Collection</h3>
            <form onSubmit={handleCreateCollection} className="space-y-3">
              <Input
                placeholder="Collection Name (e.g. System Architecture)"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                variant="premium"
                required
              />
              <Input
                placeholder="Description"
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                variant="premium"
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowCreateColModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" className="w-full" type="submit">
                  Create Collection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
