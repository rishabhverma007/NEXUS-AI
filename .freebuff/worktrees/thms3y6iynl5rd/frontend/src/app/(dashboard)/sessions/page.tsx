"use client";

import { useEffect, useState } from "react";
import { sessionRepository, UserSessionItem } from "@/repositories/session-repository";
import { Laptop, LogOut, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSessionItem[]>([]);

  const loadSessions = async () => {
    const data = await sessionRepository.getActiveSessions();
    setSessions(data);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (id: string) => {
    await sessionRepository.revokeSession(id);
    await loadSessions();
  };

  const handleRevokeAllOther = async () => {
    await sessionRepository.revokeAllOtherSessions();
    await loadSessions();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Active User Sessions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active browser sessions, device fingerprints, and remote session revocation.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleRevokeAllOther} className="gap-2 text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
          <LogOut className="h-4 w-4" />
          <span>Revoke All Other Sessions</span>
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div key={s.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                {s.os.includes("iOS") || s.os.includes("Android") ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-slate-100 text-sm">
                  <span>{s.browser}</span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span>{s.os}</span>
                  {s.isCurrent && <Badge variant="emerald">THIS DEVICE</Badge>}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  IP: {s.ipAddress} ({s.country}) — Last Active: {s.lastActiveAt}
                </div>
              </div>
            </div>

            {!s.isCurrent && (
              <Button variant="ghost" size="sm" onClick={() => handleRevoke(s.id)} className="text-rose-400 hover:text-rose-300">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
