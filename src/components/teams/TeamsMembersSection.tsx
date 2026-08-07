"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Crown,
  Eye,
  MoreHorizontal,
  PencilLine,
  RefreshCcw,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ROLE_FILTERS, STATUS_FILTERS } from "@/components/teams/mock-data";
import type {
  MemberRole,
  MemberStatus,
  RoleFilter,
  StatusFilter,
  TeamCounts,
  TeamMember,
} from "@/components/teams/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CURRENT_TEAM_ACTOR = {
  email: "elena@cloudvault.io",
  role: "Manager" as MemberRole,
  isOwner: true,
};

type ConfirmActionState =
  | {
      type: "change-status";
      member: TeamMember;
      nextStatus: MemberStatus;
    }
  | {
      type: "remove-member";
      member: TeamMember;
    };

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

function getRoleBadgeClass(role: MemberRole) {
  if (role === "Manager") {
    return "border-slate-900 bg-slate-900 text-white hover:bg-slate-900";
  }

  if (role === "Member") {
    return "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50";
  }

  return "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100";
}

function getMemberPermissions(member: TeamMember) {
  const isCurrentUser = member.email === CURRENT_TEAM_ACTOR.email;
  const canManageTarget =
    CURRENT_TEAM_ACTOR.isOwner ||
    (CURRENT_TEAM_ACTOR.role === "Manager" && member.role !== "Manager");

  return {
    canViewProfile: true,
    canEditRole: !isCurrentUser && canManageTarget,
    canChangeStatus: !isCurrentUser && canManageTarget,
    canRemove: !isCurrentUser && canManageTarget,
    disableSelfStatusChange: isCurrentUser,
    disableSelfRemoval: isCurrentUser,
  };
}

type TeamsMembersSectionProps = {
  counts: TeamCounts;
  filteredMembers: TeamMember[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: RoleFilter;
  setRoleFilter: (filter: RoleFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
};

export function TeamsMembersSection({
  counts,
  filteredMembers,
  isError,
  isLoading,
  onRetry,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: TeamsMembersSectionProps) {
  const [openMenuMemberId, setOpenMenuMemberId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setConfirmAction(null);
      }
    }

    if (confirmAction) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [confirmAction]);

  function getAvatarTone(memberId: string) {
    const tones = [
      "bg-[#2563EB] text-white",
      "bg-blue-600 text-white",
      "bg-sky-600 text-white",
      "bg-indigo-600 text-white",
      "bg-blue-500 text-white",
      "bg-cyan-600 text-white",
    ];

    const numericSeed = memberId
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);

    return tones[numericSeed % tones.length];
  }

  function handleMenuAction(action: "view-profile" | "edit-role", member: TeamMember) {
    setOpenMenuMemberId(null);
    // Intentionally no-op until real profile and role workflows are connected.
    void action;
    void member;
  }

  function handleConfirmAction(action: ConfirmActionState) {
    setOpenMenuMemberId(null);
    setConfirmAction(action);
  }

  function handleConfirmSubmit() {
    setConfirmAction(null);
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by member name or email..."
              className="h-10.5 w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 text-base focus-visible:ring-2 focus-visible:ring-blue-600/30"
            />
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200/50 bg-slate-100/80 p-1">
              {ROLE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setRoleFilter(filter)}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:flex-initial",
                    roleFilter === filter
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            <StatusFilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3.5 sm:px-6">Member</th>
                <th className="px-4 py-3.5 sm:px-6">Email</th>
                <th className="px-4 py-3.5 sm:px-6">Role</th>
                <th className="px-4 py-3.5 sm:px-6">Status</th>
                <th className="px-4 py-3.5 sm:px-6">Joined</th>
                <th className="px-4 py-3.5 text-center sm:px-6">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`team-loading-${index}`} className="animate-pulse">
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-full bg-slate-200" />
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-40 rounded bg-slate-200" />
                            <div className="h-3 w-28 rounded bg-slate-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-4 w-40 rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-8 w-24 rounded-full bg-slate-100" />
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-8 w-24 rounded-full bg-slate-100" />
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-4 w-28 rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="ml-auto h-9 w-9 rounded-xl bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-14 text-center"
                    >
                      <div className="space-y-3">
                        <p className="text-base font-medium text-slate-700">
                          We couldn&apos;t load your team members.
                        </p>
                        <p className="text-sm text-slate-400">
                          Check your organization access and try again.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onRetry}
                          className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Try again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-base text-slate-400"
                  >
                    No members match your current filters.
                  </td>
                </tr>
                )
              ) : (
                filteredMembers.map((member, index) => {
                  const permissions = getMemberPermissions(member);

                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="group transition-colors duration-200 hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-4">
                          <Avatar
                            size="lg"
                            className={cn(
                              "size-12 rounded-full border-2 border-white shadow-[0_6px_18px_rgba(148,163,184,0.24)]",
                              getAvatarTone(member.id)
                            )}
                          >
                            <AvatarImage
                              src={member.avatar}
                              alt={member.name}
                              className="rounded-full object-cover"
                            />
                            <AvatarFallback
                              className={cn(
                                "rounded-full font-bold",
                                getAvatarTone(member.id)
                              )}
                            >
                              {getMemberInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold tracking-[-0.03em] text-slate-900 sm:text-base">
                                {member.name}
                              </span>
                              {member.role === "Manager" ? (
                                <Crown className="size-4 text-blue-600" />
                              ) : null}
                            </div>
                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                              Workspace collaborator
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <span className="text-sm font-medium text-slate-600">
                          {member.email}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <Badge
                          variant={getRoleBadgeVariant(member.role)}
                          className={cn(
                            "rounded-full px-3 py-1 text-sm font-semibold",
                            getRoleBadgeClass(member.role)
                          )}
                        >
                          {member.role === "Manager" ? (
                            <Crown className="size-3.5" />
                          ) : member.role === "Member" ? (
                            <UserRound className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                          {member.role}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <Badge
                          variant={member.status === "Active" ? "secondary" : "outline"}
                          className={cn(
                            "rounded-full px-3 py-1 text-sm font-semibold",
                            member.status === "Active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-600"
                          )}
                        >
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              member.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-amber-400"
                            )}
                          />
                          {member.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-500 sm:text-base">
                          <CalendarDays className="size-4 text-slate-300" />
                          {member.joined}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap sm:px-6">
                        <DropdownMenu
                          open={openMenuMemberId === member.id}
                          onOpenChange={(open) => setOpenMenuMemberId(open ? member.id : null)}
                        >
                          <DropdownMenuTrigger
                            aria-label={`Open actions for ${member.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                          >
                            <MoreHorizontal className="size-4.5" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            side="bottom"
                            sideOffset={8}
                            className="w-56 min-w-0 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                          >
                            {permissions.canViewProfile ? (
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("view-profile", member)}
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-slate-100 focus:text-slate-900"
                              >
                                <Eye className="size-4" />
                                View profile
                              </DropdownMenuItem>
                            ) : null}

                            {permissions.canEditRole ? (
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("edit-role", member)}
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-slate-100 focus:text-slate-900"
                              >
                                <PencilLine className="size-4" />
                                Edit role
                              </DropdownMenuItem>
                            ) : null}

                            {(permissions.canChangeStatus ||
                              permissions.disableSelfStatusChange) && (
                              <DropdownMenuItem
                                disabled={permissions.disableSelfStatusChange}
                                onClick={() =>
                                  handleConfirmAction({
                                    type: "change-status",
                                    member,
                                    nextStatus:
                                      member.status === "Active" ? "Pending" : "Active",
                                  })
                                }
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-slate-100 focus:text-slate-900 data-disabled:text-slate-300"
                              >
                                <RefreshCcw className="size-4" />
                                Change status
                              </DropdownMenuItem>
                            )}

                            {(permissions.canRemove || permissions.disableSelfRemoval) && (
                              <>
                                <DropdownMenuSeparator className="my-1 bg-slate-200" />
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled={permissions.disableSelfRemoval}
                                  onClick={() =>
                                    handleConfirmAction({
                                      type: "remove-member",
                                      member,
                                    })
                                  }
                                  className="rounded-[10px] px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600 data-disabled:text-red-300"
                                >
                                  <Trash2 className="size-4" />
                                  Remove member
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 p-4 text-sm text-slate-500 sm:flex-row">
          <span className="font-medium">
            Showing {filteredMembers.length} of {counts.total} members
          </span>
          <span className="text-slate-400">
            Filter by role or status to narrow the roster
          </span>
        </footer>
      </div>

      <AnimatePresence>
        {confirmAction ? (
          <TeamMemberConfirmationDialog
            action={confirmAction}
            onCancel={() => setConfirmAction(null)}
            onConfirm={handleConfirmSubmit}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function StatusFilterSelect({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-10.5 min-w-[160px] items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-800 shadow-2xs outline-none transition-all hover:border-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-slate-500">Status:</span>
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[180px] rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={(nextValue) => onChange(nextValue as StatusFilter)}>
          {STATUS_FILTERS.map((filter) => (
            <DropdownMenuRadioItem
              key={filter}
              value={filter}
              className="rounded-xl px-3 py-2 text-sm text-slate-700 data-[checked]:bg-blue-50 data-[checked]:font-semibold data-[checked]:text-blue-700 focus:bg-slate-50 focus:text-slate-900"
            >
              <span>{filter}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeamMemberConfirmationDialog({
  action,
  onCancel,
  onConfirm,
}: {
  action: ConfirmActionState;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isRemoval = action.type === "remove-member";
  const title = isRemoval ? "Remove member?" : "Confirm status change?";
  const description = isRemoval
    ? `Remove ${action.member.name} from the organization workspace? This action should be confirmed before access is revoked.`
    : `Change ${action.member.name}'s status from ${action.member.status} to ${action.nextStatus}? This will affect how they appear in the team roster.`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-member-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              isRemoval ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"
            )}
          >
            <AlertTriangle className="size-5" />
          </div>

          <div className="space-y-2">
            <h3
              id="team-member-confirm-title"
              className="text-lg font-semibold text-slate-950"
            >
              {title}
            </h3>
            <p className="text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 rounded-full border-slate-200 px-4 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isRemoval ? "destructive" : "default"}
            onClick={onConfirm}
            className={cn(
              "h-10 rounded-full px-4",
              !isRemoval && "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {isRemoval ? "Confirm removal" : "Confirm change"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
