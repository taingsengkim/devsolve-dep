"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdminUserItem } from "@/lib/redux/services/adminApi";
import { UserStatusBadge } from "./UserStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  UserX,
  UserCheck,
  Shield,
  Building2,
  User,
  ShieldAlert,
  ChevronRight,
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
  onUpdateRole: (
    id: string,
    role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
  ) => void;
}

function UserActionsCell({
  user,
  onUpdateStatus,
  onUpdateRole,
}: {
  user: AdminUserItem;
  onUpdateStatus: (id: string, status: "ACTIVE" | "SUSPENDED") => void;
  onUpdateRole: (
    id: string,
    role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
  ) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isSuspended = user.status === "SUSPENDED";
  const targetStatus = isSuspended ? "ACTIVE" : "SUSPENDED";

  const handleConfirmStatusChange = () => {
    onUpdateStatus(user.id, targetStatus);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(true)}
          className={`h-8 px-3 rounded-xl text-xs font-semibold cursor-pointer gap-1.5 transition-colors shadow-2xs ${
            isSuspended
              ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              : "border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700"
          }`}
        >
          {isSuspended ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              Activate
            </>
          ) : (
            <>
              <UserX className="w-3.5 h-3.5" />
              Suspend
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors focus-visible:outline-none">
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
            <DropdownMenuLabel className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              User: {user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-sm font-medium cursor-pointer">
                <Shield className="w-4 h-4 mr-2 text-slate-400" />
                Change Role
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-44 rounded-xl shadow-lg">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isCurrent = user.role === opt.value;
                    return (
                      <DropdownMenuItem
                        key={opt.value}
                        disabled={isCurrent}
                        onClick={() => onUpdateRole(user.id, opt.value)}
                        className="text-sm font-medium cursor-pointer"
                      >
                        <Icon className="w-4 h-4 mr-2 text-slate-400" />
                        {opt.label}
                        {isCurrent && (
                          <span className="ml-auto text-xs text-slate-400">Current</span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowConfirm(true)}
              className={`text-sm font-medium cursor-pointer ${
                isSuspended
                  ? "text-emerald-700 dark:text-emerald-400 focus:text-emerald-700"
                  : "text-rose-600 dark:text-rose-400 focus:text-rose-600"
              }`}
            >
              {isSuspended ? (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate Account
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend Account
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspended ? "Activate User Account?" : "Suspend User Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {isSuspended ? "activate" : "suspend"} the account for{" "}
              <strong className="text-slate-900 dark:text-slate-100">{user.name}</strong> ({user.email})?
              {isSuspended
                ? " This will restore their full access to the platform."
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
                isSuspended
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {isSuspended ? "Activate Account" : "Suspend Account"}
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
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                user.name
              )}`}
            >
              {initials}
            </div>
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
          onUpdateRole={onUpdateRole}
        />
      ),
    },
  ];
}

