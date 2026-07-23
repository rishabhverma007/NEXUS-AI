"use client";

import { Folder, FolderOpen, Layers, Plus } from "lucide-react";
import { KnowledgeCollectionItem } from "@/repositories/collection-repository";

interface CollectionTreeProps {
  collections: KnowledgeCollectionItem[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onCreateCollectionClick: () => void;
}

export function CollectionTree({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollectionClick,
}: CollectionTreeProps) {
  return (
    <div className="w-64 h-full border-r border-slate-800/80 bg-slate-950/60 p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">
            Collections
          </span>
        </div>
        <button
          onClick={onCreateCollectionClick}
          className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          title="Create New Collection"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onSelectCollection(null)}
          className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
            selectedCollectionId === null
              ? "bg-blue-600/20 text-cyan-400 border border-blue-500/40 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>All Documents</span>
          </div>
        </button>

        {collections.map((col) => {
          const isSelected = selectedCollectionId === col.id;
          return (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-blue-600/20 text-cyan-400 border border-blue-500/40 font-bold shadow-glow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{col.name}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {col.documentCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
