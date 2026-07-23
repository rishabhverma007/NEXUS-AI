"use client";

import { useEffect, useState } from "react";
import { orgRepository, OrganizationItem, OrgInvitation } from "@/repositories/org-repository";
import { Building2, Mail, Plus, ShieldAlert, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function OrganizationPage() {
  const [org, setOrg] = useState<OrganizationItem | null>(null);
  const [invitations, setInvitations] = useState<OrgInvitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const loadData = async () => {
    const data = await orgRepository.getOrganization();
    const invs = await orgRepository.getInvitations();
    setOrg(data);
    setInvitations(invs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await orgRepository.sendInvitation(inviteEmail, "member");
    setInviteEmail("");
    await loadData();
  };

  if (!org) return null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-nexus-50 tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-nexus-brand-light" />
          Organization Management
        </h1>
        <p className="text-sm text-nexus-400 mt-1">
          Root identity scope for enterprise teams, billing, and global workspace policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="nexus-glass rounded-2xl border border-nexus-border p-6 space-y-4">
          <h3 className="text-sm font-semibold text-nexus-200">Organization Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-nexus-500 font-mono block">Organization Name</span>
              <span className="font-bold text-nexus-50">{org.name}</span>
            </div>
            <div>
              <span className="text-xs text-nexus-500 font-mono block">Slug / Domain</span>
              <span className="font-mono text-nexus-accent">{org.slug}</span>
            </div>
            <div>
              <span className="text-xs text-nexus-500 font-mono block">Industry</span>
              <span className="text-nexus-300">{org.industry}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 nexus-glass rounded-2xl border border-nexus-border p-6 space-y-4">
          <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
            <Mail className="h-4 w-4 text-nexus-accent" />
            Pending Invitations
          </h3>

          <form onSubmit={handleSendInvite} className="flex gap-3">
            <Input
              type="email"
              placeholder="invite-engineer@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              variant="premium"
              className="flex-1"
              required
            />
            <Button variant="primary" size="sm" type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Send Invite</span>
            </Button>
          </form>

          <div className="space-y-3 pt-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-nexus-850/60 border border-nexus-border flex items-center justify-between text-sm hover:border-nexus-border-hover transition-all">
                <div>
                  <div className="font-semibold text-nexus-200">{inv.email}</div>
                  <div className="text-xs text-nexus-500">Sent: {inv.sentAt.substring(0, 10)}</div>
                </div>
                <Badge variant="amber" className="uppercase">
                  {inv.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
