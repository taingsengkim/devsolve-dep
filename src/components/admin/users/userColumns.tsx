"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdminUserItem } from "@/lib/redux/services/adminApi";
import type { ModerationActionType } from "@/lib/types/admin/types";
import { UserStatusBadge } from "./UserStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  UserX,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
  Trash2,
  Ban,
  RotateCcw,
} from "lucide-react";

const ROLE_OPTIONS: {
  value: "USER" | "COMPANY" | "ADMIN";
  label: string;
}[] = [
  { value: "USER", label: "USER" },
  { value: "COMPANY", label: "COMPANY" },
  { value: "ADMIN", label: "ADMIN" },
];

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
  onModerateUser,
}: {
  user: AdminUserItem;
  onModerateUser?: (user: AdminUserItem, actionType?: ModerationActionType) => void;
}) {
  const isRemoved = user.status === "REMOVED";
  const isSuspended = user.status === "SUSPENDED";
  const isActive = user.status === "ACTIVE";

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
          className="w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          {onModerateUser && (
            <DropdownMenuGroup className="flex flex-col gap-0.5">
              <DropdownMenuItem
                onClick={() => onModerateUser(user, "WARN")}
                disabled={isRemoved}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300"
              >
                <AlertTriangle className="size-3.5" />
                <span>{isRemoved ? "Warn (user removed)" : "Warn user"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "SUSPEND")}
                disabled={isSuspended || isRemoved}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive focus:text-destructive"
              >
                <UserX className="size-3.5" />
                <span>
                  {isRemoved
                    ? "Suspend (user removed)"
                    : isSuspended
                    ? "Suspend (already suspended)"
                    : "Suspend account"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "REMOVE")}
                disabled={isRemoved}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5" />
                <span>{isRemoved ? "Remove (already removed)" : "Remove account"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "BAN")}
                disabled={isRemoved}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive focus:text-destructive"
              >
                <Ban className="size-3.5" />
                <span>{isRemoved ? "Ban (user removed)" : "Ban user"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModerateUser(user, "REINSTATE")}
                disabled={isActive}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <RotateCcw className="size-3.5" />
                <span>
                  {isActive
                    ? "Reinstate (already active)"
                    : "Reinstate account"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function getUserColumns({
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
          <ArrowUpDown data-icon="inline-end" />
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
            <Avatar className="size-9 shrink-0 border border-slate-200 dark:border-slate-700">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={displayName} />
              )}
              <AvatarFallback className="bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {displayName}
              </div>
              <div className="truncate text-sm text-slate-500 dark:text-slate-400">
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
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        const opt = ROLE_OPTIONS.find((r) => r.value === role) ?? ROLE_OPTIONS[0];
        return (
          <Badge variant="secondary" className="rounded-lg">
            {opt.label}
          </Badge>
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
          <ArrowUpDown data-icon="inline-end" />
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
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        const reports = u.reportsSubmitted ?? 0;
        const rep = u.reputation ?? 0;
        return (
          <div className="flex flex-col gap-0.5 text-sm">
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
          <ArrowUpDown data-icon="inline-end" />
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
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
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
          onModerateUser={onModerateUser}
        />
      ),
    },
  ];
}
