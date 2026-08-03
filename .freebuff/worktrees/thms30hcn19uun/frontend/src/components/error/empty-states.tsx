"use client";

import Link from "next/link";
import { AlertTriangle, Database, Search, WifiOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptySearchState({ query }: { query?: string }) {
  return (
    <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 w-fit mx-auto">
        <Search className="h-8 w-8 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-slate-100">No Vector Chunks Found</h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        No document chunks or graph entities matched query {query ? `'${query}'` : ""}. Try adjusting search filters or ingest new markdown specs.
      </p>
    </div>
  );
}

export function OfflineErrorState() {
  return (
    <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 w-fit mx-auto">
        <WifiOff className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-100">System Connection Interrupted</h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        Unable to connect to FastAPI backend SSE gateway. Checking reconnection status...
      </p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry Connection
      </Button>
    </div>
  );
}

export function PageNotFoundState() {
  return (
    <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 w-fit mx-auto">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-extrabold text-slate-100">404 — Route Not Found</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        The system route you are attempting to access does not exist in the NEXUS AI operating system topology.
      </p>
      <Link href="/chat">
        <Button variant="primary" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Operating System</span>
        </Button>
      </Link>
    </div>
  );
}
