"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProgramManagementSummaryItem } from "@/lib/types/admin/programAdminTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, ShieldCheck, Clock, XCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const getSubmissionBadge = (status: string) => {
  switch (status) {
    case "PENDING_REVIEW":
      return (
        <Badge className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending Review
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="rounded-lg text-xs font-medium">
          {status}
        </Badge>
      );
  }
};

const getStateBadge = (state: string) => {
  switch (state) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    case "PAUSED":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Paused
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Closed
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          Draft
        </span>
      );
  }
};

const getEngagementBadge = (type: string) => {
  if (type === "BOUNTY") {
    return (
      <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        BOUNTY
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
      VDP / RESPONSE
    </span>
  );
};

export const getProgramColumns = (): ColumnDef<ProgramManagementSummaryItem>[] => [
  {
    accessorKey: "name",
    header: "Program Details",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/admin-program-management/${item.id}`}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
            >
              {item.name}
            </Link>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              @{item.handle}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "engagementType",
    header: "Type",
    cell: ({ row }) => getEngagementBadge(row.original.engagementType),
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
        {row.original.visibility}
      </span>
    ),
  },
  {
    accessorKey: "state",
    header: "Lifecycle State",
    cell: ({ row }) => getStateBadge(row.original.state),
  },
  {
    accessorKey: "submissionState",
    header: "Review Status",
    cell: ({ row }) => getSubmissionBadge(row.original.submissionState),
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => {
      const val = row.original.createdAt;
      const formatted = val ? new Date(val).toLocaleDateString() : "—";
      return <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatted}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex justify-end">
          <Link href={`/dashboard/admin-program-management/${item.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8 px-3 text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              Review
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
