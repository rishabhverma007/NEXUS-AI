"use client";

import { useState } from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { usePermissions } from "@/hooks/use-permissions";
import { Database, Plus, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function WorkspacePage() {
  const { currentWorkspace, members, inviteMember, isInvitingMember } = useWorkspace();
  const { can } = usePermissions();
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await inviteMember({ email: inviteEmail, role: "editor" });
    setInviteEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-cyan-400" />
            Workspace Settings & Members
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-tenant workspace members, roles, and resource access limits.
          </p>
        </div>

        {can("invite_members") && (
          <Button variant="primary" size="sm" className="gap-2" onClick={() => setShowInviteModal(true)}>
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Workspace ID</span>
          <div className="text-sm font-bold text-slate-100 font-mono">{currentWorkspace.id}</div>
          <p className="text-xs text-slate-400">{currentWorkspace.description}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Active Members</span>
          <div className="text-sm font-bold text-slate-100 font-mono">{members.length} Workspace Users</div>
          <p className="text-xs text-slate-400">Scoped with RLS security policies.</p>
        </div>
      </div>

      {/* Member Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          Workspace Members & Roles
        </h3>

        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-100">{m.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
              </div>

              <Badge variant={m.role === "owner" ? "cyan" : "secondary"} className="uppercase">
                {m.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100">Invite Member to Workspace</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <Input
                type="email"
                placeholder="colleague@nexus.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" className="w-full" type="submit" isLoading={isInvitingMember}>
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
