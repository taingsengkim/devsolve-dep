"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Crown,
  Eye,
  MoreHorizontal,
  PencilLine,
  RefreshCcw,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [openMenuMemberId, setOpenMenuMemberId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);

  const hasActiveFilters = roleFilter !== "All" || statusFilter !== "All";

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

  function getAvatarTone(memberId: number) {
    const tones = [
      "bg-[#2563EB] text-white",
      "bg-blue-600 text-white",
      "bg-sky-600 text-white",
      "bg-indigo-600 text-white",
      "bg-blue-500 text-white",
      "bg-cyan-600 text-white",
    ];

    return tones[(memberId - 1) % tones.length];
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
      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(148,163,184,0.16)]">
        <div className="border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                Members
                <span className="ml-2 text-slate-400">({counts.total})</span>
              </h2>
              <p className="text-sm leading-6 text-slate-400">
                Showing {filteredMembers.length} of {counts.total} members
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:items-center">
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-[0_2px_8px_rgba(148,163,184,0.12)]">
                {ROLE_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRoleFilter(filter)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm",
                      roleFilter === filter
                        ? "bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-[0_2px_8px_rgba(148,163,184,0.12)]">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm",
                      statusFilter === filter
                        ? "bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                  className="h-10 rounded-full px-4 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-5 py-4 sm:px-6">Member</th>
                <th className="px-5 py-4 sm:px-6">Role</th>
                <th className="px-5 py-4 sm:px-6">Status</th>
                <th className="px-5 py-4 sm:px-6">Joined</th>
                <th className="px-5 py-4 text-right sm:px-6">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center text-base text-slate-400"
                  >
                    No members match your current filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => {
                  const permissions = getMemberPermissions(member);

                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="group transition-colors duration-200 hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-5 sm:px-6">
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
                              <span className="truncate text-base font-semibold tracking-[-0.02em] text-slate-950 sm:text-lg">
                                {member.name}
                              </span>
                              {member.role === "Manager" ? (
                                <Crown className="size-4 text-[#2563EB]" />
                              ) : null}
                            </div>
                            <p className="truncate text-sm leading-6 text-slate-500 sm:text-base">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 whitespace-nowrap sm:px-6">
                        <Badge
                          variant={getRoleBadgeVariant(member.role)}
                          className={cn(
                            "rounded-full px-3 py-1 text-sm font-semibold",
                            member.role === "Manager" &&
                              "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
                            member.role === "Member" &&
                              "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
                            member.role === "Viewer" &&
                              "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
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

                      <td className="px-5 py-5 whitespace-nowrap sm:px-6">
                        <Badge
                          variant={member.status === "Active" ? "secondary" : "outline"}
                          className={cn(
                            "rounded-full px-3 py-1 text-sm font-semibold",
                            member.status === "Active"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-amber-200 bg-amber-50 text-amber-500"
                          )}
                        >
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              member.status === "Active"
                                ? "bg-[#2563EB]"
                                : "bg-amber-400"
                            )}
                          />
                          {member.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-5 whitespace-nowrap sm:px-6">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-500 sm:text-base">
                          <CalendarDays className="size-4 text-slate-300" />
                          {member.joined}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-right whitespace-nowrap sm:px-6">
                        <DropdownMenu
                          open={openMenuMemberId === member.id}
                          onOpenChange={(open) => setOpenMenuMemberId(open ? member.id : null)}
                        >
                          <DropdownMenuTrigger
                            aria-label={`Open actions for ${member.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
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
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]"
                              >
                                <Eye className="size-4" />
                                View profile
                              </DropdownMenuItem>
                            ) : null}

                            {permissions.canEditRole ? (
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("edit-role", member)}
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]"
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
                                className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB] data-disabled:text-slate-300"
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

        <footer className="border-t border-slate-200/80 px-5 py-4 text-sm text-slate-400 sm:px-6">
          Showing {filteredMembers.length} of {counts.total} members
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
              isRemoval ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#2563EB]"
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
              !isRemoval &&
                "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
            )}
          >
            {isRemoval ? "Confirm removal" : "Confirm change"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
