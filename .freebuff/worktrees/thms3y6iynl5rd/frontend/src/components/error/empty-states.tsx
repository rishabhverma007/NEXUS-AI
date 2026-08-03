"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Database,
  Search,
  WifiOff,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptySearchState({ query }: { query?: string }) {
  return (
    <div className="glass-card rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-amber-400 w-fit mx-auto">
        <Search className="h-8 w-8 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-100">
          No Vector Chunks Found
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          No document chunks or graph entities matched
          {query ? (
            <>
              {" "}
              <span className="text-slate-300 font-mono">&lsquo;{query}&rsquo;</span>
            </>
          ) : (
            ""
          )}
          . Try adjusting search filters or ingest new markdown specs.
        </p>
      </div>
    </div>
  );
}

export function OfflineErrorState() {
  return (
    <div className="glass-card rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-rose-400 w-fit mx-auto">
        <WifiOff className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-100">
          System Connection Interrupted
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Unable to connect to FastAPI backend SSE gateway. Checking
          reconnection status...
        </p>
      </div>
      <Button
        variant="glass"
        size="sm"
        onClick={() => window.location.reload()}
      >
        Retry Connection
      </Button>
    </div>
  );
}

export function PageNotFoundState() {
  return (
    <div className="glass-card rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto my-12">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-nexus-400 w-fit mx-auto">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-100">
          404 — Route Not Found
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The system route you are attempting to access does not exist in the
          NEXUS AI operating system topology.
        </p>
      </div>
      <Link href="/chat">
        <Button variant="gradient" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Operating System</span>
        </Button>
      </Link>
    </div>
  );
}
