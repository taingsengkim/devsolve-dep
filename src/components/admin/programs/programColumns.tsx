"use client";

import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Building2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ProgramReviewBadge,
  ProgramStateBadge,
} from "@/components/admin/programs/ProgramStatusBadge";
import { ProgramManagementSummaryItem } from "@/lib/types/admin/programAdminTypes";

/** The sortable header the users table uses, so both read the same. */
function SortableHeader({
  label,
  column,
}: {
  label: string;
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="cursor-pointer px-0 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-transparent dark:text-slate-300"
    >
      {label}
      <ArrowUpDown data-icon="inline-end" />
    </Button>
  );
}

function initialsOf(name?: string) {
  const initials = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return initials || "P";
}

export const getProgramColumns =
  ({ scope = "owner" }: { scope?: "owner" | "admin" } = {}): ColumnDef<ProgramManagementSummaryItem>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader label="Program" column={column} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-0.5">
            <Avatar className="size-9 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700">
              <AvatarFallback className="rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {initialsOf(item.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link
                href={`/dashboard/program-management/${item.id}${
                  scope === "admin" ? "?scope=admin" : ""
                }`}
                className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
              >
                {item.name}
              </Link>
              <div className="truncate text-sm text-slate-500 dark:text-slate-400">
                @{item.handle}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "organizationName",
      header: ({ column }) => (
        <SortableHeader label="Organization" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Building2 aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{row.original.organizationName || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "engagementType",
      header: ({ column }) => <SortableHeader label="Type" column={column} />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="rounded-lg">
          {row.original.engagementType === "BOUNTY" ? "BOUNTY" : "RESPONSE"}
        </Badge>
      ),
    },
    {
      accessorKey: "visibility",
      header: ({ column }) => (
        <SortableHeader label="Visibility" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {row.original.visibility}
        </span>
      ),
    },
    {
      accessorKey: "state",
      header: ({ column }) => (
        <SortableHeader label="Lifecycle" column={column} />
      ),
      cell: ({ row }) => <ProgramStateBadge state={row.original.state} />,
    },
    {
      accessorKey: "submissionState",
      header: ({ column }) => (
        <SortableHeader label="Review Status" column={column} />
      ),
      cell: ({ row }) => (
        <ProgramReviewBadge status={row.original.submissionState} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader label="Submitted" column={column} />
      ),
      cell: ({ row }) => {
        const raw = row.original.createdAt;
        const formatted =
          raw && !Number.isNaN(Date.parse(raw))
            ? new Date(raw).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—";
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
        <div className="text-right text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Button
            render={
              <Link
                href={`/dashboard/program-management/${row.original.id}${
                  scope === "admin" ? "?scope=admin" : ""
                }`}
              />
            }
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer rounded-xl border-slate-200 px-3 text-sm font-semibold shadow-2xs hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            {scope === "admin" ? "Review" : "View"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      ),
    },
  ];
