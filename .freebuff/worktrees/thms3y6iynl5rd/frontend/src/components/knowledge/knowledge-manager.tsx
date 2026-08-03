"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  FileText, 
  Upload, 
  Search, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Loader2 
} from "lucide-react";
import { fetchDocuments, uploadDocument } from "@/lib/api";
import { KnowledgeDocument } from "@/types/nexus";

export function KnowledgeManager() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDocs = async () => {
    const docs = await fetchDocuments();
    setDocuments(docs);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || isUploading) return;

    setIsUploading(true);
    try {
      await uploadDocument(title, content, "markdown");
      setTitle("");
      setContent("");
      await loadDocs();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-cyan-400" />
            Knowledge Management Base
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise document ingestion with semantic chunking & pgvector HNSW indexing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            Total Ingested: {documents.length} Docs
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Upload Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Upload className="h-4 w-4 text-blue-400" />
            Ingest Document / Spec
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed System Specification"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Markdown Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste Markdown document content here..."
                rows={8}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !title || !content}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-glow disabled:opacity-40"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>Chunk & Ingest into pgvector</span>
            </button>
          </form>
        </div>

        {/* Indexed Document List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              Indexed Documents & Vector Chunks
            </h2>

            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter documents..."
                className="pl-8 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No documents ingested yet. Upload a document to start hybrid vector search.
              </div>
            ) : (
              documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-100">{doc.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Type: {doc.source_type}</span>
                      <span>•</span>
                      <span>{doc.chunk_count} Chunks</span>
                      <span>•</span>
                      <span>{doc.file_size_bytes} Bytes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
