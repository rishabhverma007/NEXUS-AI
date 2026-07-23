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
    <div className="w-64 h-full border-r border-nexus-border/80 bg-nexus-950/60 p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-nexus-border/60">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-nexus-accent" />
          <span className="font-semibold text-nexus-50 uppercase tracking-wider text-[11px]">
            Collections
          </span>
        </div>
        <button
          onClick={onCreateCollectionClick}
          className="p-1 rounded-md bg-nexus-850 border border-nexus-border text-nexus-300 hover:text-white"
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
              ? "bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/40 font-bold"
              : "text-nexus-400 hover:text-nexus-200 hover:bg-nexus-850/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5 text-nexus-accent" />
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
                  ? "bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/40 font-bold shadow-glow"
                  : "text-nexus-400 hover:text-nexus-200 hover:bg-nexus-850/60"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className="h-3.5 w-3.5 text-nexus-brand-light flex-shrink-0" />
                <span className="truncate">{col.name}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-nexus-850 text-nexus-400 border border-nexus-border">
                {col.documentCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
