"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdminUserItem } from "@/lib/redux/services/adminApi";
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
  UserX,
  UserCheck,
  Shield,
  Building2,
  User,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";

const ROLE_OPTIONS: {
  value: "USER" | "COMPANY" | "ADMIN" | "MODERATOR";
  label: string;
  icon: React.ElementType;
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
  onUpdateStatus: (id: string, status: "ACTIVE" | "SUSPENDED") => void;
  onUpdateRole?: (
    id: string,
    role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
  ) => void;
}

function UserActionsCell({
  user,
  onUpdateStatus,
}: {
  user: AdminUserItem;
  onUpdateStatus: (id: string, status: "ACTIVE" | "SUSPENDED") => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isSuspended = user.status === "SUSPENDED";
  const isPending = user.status === "PENDING";
  const shouldActivate = isSuspended || isPending;
  const targetStatus: "ACTIVE" | "SUSPENDED" = shouldActivate ? "ACTIVE" : "SUSPENDED";

  const handleConfirmStatusChange = () => {
    onUpdateStatus(user.id, targetStatus);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(true)}
          className={`h-8 px-3 rounded-xl text-xs font-semibold cursor-pointer gap-1.5 transition-colors shadow-2xs ${
            shouldActivate
              ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              : "border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700"
          }`}
        >
          {shouldActivate ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              {isPending ? "Approve" : "Activate"}
            </>
          ) : (
            <>
              <UserX className="w-3.5 h-3.5" />
              Suspend
            </>
          )}
        </Button>
      </div>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {shouldActivate
                ? isPending
                  ? "Approve & Activate User Account?"
                  : "Activate User Account?"
                : "Suspend User Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {shouldActivate ? "activate" : "suspend"} the account for{" "}
              <strong className="text-slate-900 dark:text-slate-100">{user.name}</strong> ({user.email})?
              {shouldActivate
                ? " This will give them full access to the platform."
                : " This will immediately block their access to platform services."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className={`rounded-xl text-sm font-semibold cursor-pointer ${
                shouldActivate
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {shouldActivate ? (isPending ? "Approve & Activate" : "Activate Account") : "Suspend Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function getUserColumns({
  onUpdateStatus,
  onUpdateRole,
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
        const initials = user.name
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-3 py-0.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                  user.name
                )}`}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                {user.name}
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
      cell: ({ row }) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {row.original.joinedDate}
        </span>
      ),
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
        />
      ),
    },
  ];
}

