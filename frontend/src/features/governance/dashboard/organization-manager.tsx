"use client";

import { useOrganizations } from "@/hooks/use-organizations";
import { Building2, Users, FolderGit2, ShieldCheck, ChevronRight, Layers } from "lucide-react";

export function OrganizationManager() {
  const { orgDetails, isLoading } = useOrganizations();

  if (isLoading) {
    return (
      <div className="p-6 text-center border border-nexus-border rounded-xl bg-nexus-850/60 animate-pulse">
        <Building2 className="h-6 w-6 text-nexus-400 mx-auto mb-2" />
        <span className="text-xs text-nexus-400">Loading organization hierarchy...</span>
      </div>
    );
  }

  const { organization, departments, teams, projects } = orgDetails;

  return (
    <div className="space-y-6">
      {/* Top Organization Header */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-nexus-accent to-nexus-brand-light shadow-glow">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-nexus-50">{organization?.name || "Enterprise Global Org"}</h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30 uppercase">
                {organization?.tier || "Enterprise Ultimate"}
              </span>
            </div>
            <p className="text-xs text-nexus-400">Domain: {organization?.domain || "acme.com"}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-nexus-300">
          <div>
            <span className="text-nexus-400 block text-[11px]">Workspaces Limit</span>
            <span className="font-bold text-nexus-50">{organization?.maxWorkspaces || 50} Max</span>
          </div>
          <div>
            <span className="text-nexus-400 block text-[11px]">Seats Capacity</span>
            <span className="font-bold text-nexus-accent">{organization?.maxSeats || 500} Seats</span>
          </div>
        </div>
      </div>

      {/* Organization Hierarchy Tree */}
      <div className="p-5 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass space-y-4">
        <h3 className="text-sm font-semibold text-nexus-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-nexus-accent" /> Departments, Teams & Projects Hierarchy
        </h3>

        <div className="space-y-4">
          {departments.map((dept) => {
            const deptTeams = teams.filter((t) => t.departmentId === dept.id);

            return (
              <div key={dept.id} className="p-4 rounded-lg bg-nexus-950/70 border border-nexus-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-nexus-brand-light" />
                    <h4 className="text-xs font-bold text-nexus-50">{dept.name}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-nexus-accent">Budget: ${dept.budgetUsd.toLocaleString()}</span>
                </div>

                <div className="pl-6 space-y-2 border-l border-nexus-border">
                  {deptTeams.map((team) => (
                    <div key={team.id} className="p-2.5 rounded bg-nexus-850/80 border border-nexus-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-nexus-400" />
                        <Users className="h-3.5 w-3.5 text-nexus-accent" />
                        <span className="font-semibold text-nexus-200">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-3.5 w-3.5 text-nexus-emerald" />
                        <span className="text-[11px] text-nexus-400">{projects.length} Active Projects</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
