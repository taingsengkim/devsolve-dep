"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProblemResponse } from "@/lib/types/admin/problemAdminTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING_APPROVAL":
      return (
        <Badge className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending Approval
        </Badge>
      );
    case "PUBLISHED":
      return (
        <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Published
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

interface ProblemColumnsProps {
  onModerate: (problem: ProblemResponse) => void;
}

export const getProblemColumns = ({
  onModerate,
}: ProblemColumnsProps): ColumnDef<ProblemResponse>[] => [
  {
    accessorKey: "title",
    header: "Problem Title",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <button
              onClick={() => onModerate(item)}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate block w-full cursor-pointer"
            >
              {item.title}
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {item.category?.name || "General"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {author?.fullName || "Anonymous"}
        </span>
      );
    },
  },
  {
    accessorKey: "sdlcPhase",
    header: "SDLC Phase",
    cell: ({ row }) => (
      <Badge variant="secondary" className="rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
        {row.original.sdlcPhase || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModerate(item)}
            className="rounded-xl h-8 px-3 text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            Moderate
          </Button>
        </div>
      );
    },
  },
];
