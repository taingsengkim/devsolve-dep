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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Members
              <span className="ml-2 text-slate-400">({counts.total})</span>
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Manage your organization access by role and invitation status.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map((filter) => (
                <Button
                  key={filter}
                  variant={roleFilter === filter ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    roleFilter !== filter && "bg-white text-slate-600"
                  )}
                  onClick={() => setRoleFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Separator
                orientation="vertical"
                className="hidden h-6 bg-slate-200 lg:block"
              />
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full",
                      statusFilter !== filter && "bg-white text-slate-600"
                    )}
                    onClick={() => setStatusFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/80 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="ring-1 ring-slate-200/80">
                          <AvatarFallback className="bg-slate-100 font-semibold text-slate-700">
                            {getMemberInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-base font-semibold text-slate-900">
                            {member.name}
                          </span>
                          <span className="truncate text-sm text-slate-500">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={getRoleBadgeVariant(member.role)}
                        className={cn(
                          member.role === "Manager" &&
                            "bg-blue-600 text-white hover:bg-blue-700",
                          member.role === "Member" &&
                            "bg-slate-900 text-white hover:bg-slate-800"
                        )}
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={member.status === "Active" ? "secondary" : "outline"}
                        className={cn(
                          member.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        )}
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      {member.joined}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full text-slate-500"
                        aria-label={`More actions for ${member.name}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-500">
            Showing {filteredMembers.length} of {counts.total} members
          </p>
          <p className="text-sm text-slate-400">
            {counts.pending} invitation{counts.pending === 1 ? "" : "s"} pending approval
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
