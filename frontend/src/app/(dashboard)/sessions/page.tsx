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
          <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-nexus-emerald" />
            Active User Sessions
          </h1>
          <p className="text-sm text-nexus-400 mt-1">
            Manage active browser sessions, device fingerprints, and remote session revocation.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleRevokeAllOther} className="gap-2 text-nexus-rose border-nexus-rose/30 hover:bg-nexus-rose/10">
          <LogOut className="h-4 w-4" />
          <span>Revoke All Other Sessions</span>
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div key={s.id} className="nexus-glass rounded-2xl border border-nexus-border p-5 flex items-center justify-between hover:border-nexus-border-hover transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-nexus-850 border border-nexus-border text-nexus-accent">
                {s.os.includes("iOS") || s.os.includes("Android") ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-nexus-50 text-sm">
                  <span>{s.browser}</span>
                  <span className="text-nexus-500 text-xs">•</span>
                  <span>{s.os}</span>
                  {s.isCurrent && <Badge variant="emerald">THIS DEVICE</Badge>}
                </div>
                <div className="text-xs text-nexus-400 font-mono">
                  IP: {s.ipAddress} ({s.country}) — Last Active: {s.lastActiveAt}
                </div>
              </div>
            </div>

            {!s.isCurrent && (
              <Button variant="ghost" size="sm" onClick={() => handleRevoke(s.id)} className="text-nexus-rose hover:text-nexus-rose/80">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
