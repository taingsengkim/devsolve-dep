import { MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";

import { ROLE_FILTERS, STATUS_FILTERS } from "@/components/teams/mock-data";
import type {
  MemberRole,
  RoleFilter,
  StatusFilter,
  TeamCounts,
  TeamMember,
} from "@/components/teams/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getMemberInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleBadgeVariant(role: MemberRole) {
  if (role === "Manager") return "default";
  if (role === "Member") return "secondary";
  return "outline";
}

type TeamsMembersSectionProps = {
  counts: TeamCounts;
  filteredMembers: TeamMember[];
  roleFilter: RoleFilter;
  setRoleFilter: (filter: RoleFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
};

export function TeamsMembersSection({
  counts,
  filteredMembers,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: TeamsMembersSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Members
          <span className="ml-2 text-slate-400">({counts.total})</span>
        </h2>
        <p className="mt-1 text-base text-slate-500">
          Manage organization access by role and invitation status.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            Total {counts.total}
          </Badge>
          <Badge variant="outline" className="border-emerald-200 bg-white text-emerald-700">
            {counts.active} active
          </Badge>
          <Badge variant="outline" className="border-amber-200 bg-white text-amber-700">
            {counts.pending} pending
          </Badge>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setRoleFilter(filter)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  roleFilter === filter
                    ? "bg-blue-600 font-semibold text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  statusFilter === filter
                    ? "bg-slate-900 font-semibold text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3.5 sm:px-6">Member</th>
                <th className="px-4 py-3.5 sm:px-6">Role</th>
                <th className="px-4 py-3.5 sm:px-6">Status</th>
                <th className="px-4 py-3.5 sm:px-6">Joined</th>
                <th className="px-4 py-3.5 text-right sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No members match your current filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                          <AvatarFallback className="rounded-xl bg-slate-100 font-semibold text-slate-700">
                            {getMemberInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                            {member.name}
                          </span>
                          <span className="truncate text-xs text-slate-500 sm:text-sm">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <Badge
                        variant={getRoleBadgeVariant(member.role)}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-sm font-semibold",
                          member.role === "Manager" &&
                            "bg-blue-600 text-white hover:bg-blue-700",
                          member.role === "Member" &&
                            "bg-slate-900 text-white hover:bg-slate-800"
                        )}
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <Badge
                        variant={member.status === "Active" ? "secondary" : "outline"}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-sm font-semibold",
                          member.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        )}
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-600 sm:px-6">
                      {member.joined}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap sm:px-6">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`More actions for ${member.name}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 p-4 sm:flex-row">
          <span className="text-sm font-medium text-slate-500">
            Showing {filteredMembers.length} of {counts.total} members
          </span>
          <span className="text-sm text-slate-400">
            {counts.pending} invitation{counts.pending === 1 ? "" : "s"} pending approval
          </span>
        </footer>
      </div>
    </div>
  );
}
