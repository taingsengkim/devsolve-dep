"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdminUserItem } from "@/lib/redux/services/adminApi";
import type { ModerationActionType } from "@/lib/types/admin/types";
import { UserStatusBadge } from "./UserStatusBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  UserX,
  UserCheck,
  Shield,
  Building2,
  User,
  ShieldAlert,
  ArrowUpDown,
  Gavel,
  MoreHorizontal,
} from "lucide-react";

const ROLE_OPTIONS: {
  value: "USER" | "COMPANY" | "ADMIN" | "MODERATOR";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "USER", label: "Researcher", icon: User },
  { value: "COMPANY", label: "Company", icon: Building2 },
  { value: "ADMIN", label: "Admin", icon: Shield },
  { value: "MODERATOR", label: "Moderator", icon: ShieldAlert },
];

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

interface ColumnCallbacks {
  onUpdateStatus?: (id: string, status: "ACTIVE" | "SUSPENDED") => void;
  onModerateUser?: (user: AdminUserItem, actionType?: ModerationActionType) => void;
  onUpdateRole?: (
    id: string,
    role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
  ) => void;
}

function UserActionsCell({
  user,
  onUpdateStatus,
  onModerateUser,
}: {
  user: AdminUserItem;
  onUpdateStatus?: (id: string, status: "ACTIVE" | "SUSPENDED") => void;
  onModerateUser?: (user: AdminUserItem, actionType?: ModerationActionType) => void;
}) {
  const isRemoved = user.status === "REMOVED";
  const isSuspended = user.status === "SUSPENDED";
  const isPending = user.status === "PENDING";
  const canActivate = isSuspended || isPending || isRemoved;

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer shadow-2xs">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-lg space-y-0.5"
        >
          {canActivate && onUpdateStatus && (
            <>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex items-center justify-between"
              >
                <span><strong className="font-bold">ACTIVATE</strong> &mdash; Restore & activate account</span>
                <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />
            </>
          )}

          {onModerateUser && (
            <>
              <DropdownMenuItem
                onClick={() => onModerateUser(user, "WARN")}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer"
              >
                <span><strong className="font-bold">WARN</strong> &mdash; Issue official warning</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "SUSPEND")}
                disabled={isSuspended}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-700 dark:hover:text-orange-400 cursor-pointer",
                  isSuspended && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <span><strong className="font-bold">SUSPEND</strong> &mdash; {isSuspended ? "Already suspended" : "Temporarily suspend"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "REMOVE")}
                disabled={isRemoved}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer",
                  isRemoved && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <span><strong className="font-bold">REMOVE</strong> &mdash; {isRemoved ? "Already removed" : "Hide or delete content/account"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "BAN")}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-400 cursor-pointer"
              >
                <span><strong className="font-bold">BAN</strong> &mdash; Permanently ban entity</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function getUserColumns({
  onUpdateStatus,
  onModerateUser,
}: ColumnCallbacks): ColumnDef<AdminUserItem>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          User
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const displayName = user.name || (user as { fullName?: string }).fullName || user.email || "User";
        const initials = displayName
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase() || "U";
        return (
          <div className="flex items-center gap-3 py-0.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                  displayName
                )}`}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                {displayName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Role
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        const opt = ROLE_OPTIONS.find((r) => r.value === role) ?? ROLE_OPTIONS[0];
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span>{opt.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Status
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "reportsSubmitted",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Activity
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        const reports = u.reportsSubmitted ?? 0;
        const rep = u.reputation ?? 0;
        return (
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              {reports} report{reports === 1 ? "" : "s"}
            </div>
            <div className="text-slate-400 dark:text-slate-500">
              {rep} rep points
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "joinedDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Joined Date
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.original.joinedDate;
        let formatted = rawDate;
        if (rawDate && !isNaN(Date.parse(rawDate))) {
          formatted = new Date(rawDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        return (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {formatted}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          onUpdateStatus={onUpdateStatus}
          onModerateUser={onModerateUser}
        />
      ),
    },
  ];
}
