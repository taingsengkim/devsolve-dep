"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SolutionResponse } from "@/lib/types/admin/solutionAdminTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle2, XCircle, Video, FileCode } from "lucide-react";

const getReviewStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending Review
        </Badge>
      );
    case "APPROVED":
    case "ACCEPTED":
      return (
        <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1 text-xs font-semibold gap-1.5 shadow-none">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status}
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

interface SolutionColumnsProps {
  onReview: (solution: SolutionResponse) => void;
}

export const getSolutionColumns = ({
  onReview,
}: SolutionColumnsProps): ColumnDef<SolutionResponse>[] => [
  {
    accessorKey: "id",
    header: "Solution ID / Description",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <button
              onClick={() => onReview(item)}
              className="font-semibold font-mono text-xs text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate block w-full cursor-pointer"
            >
              ID: {item.id}
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {item.description || "No description"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "problemId",
    header: "Problem ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
        {row.original.problemId}
      </span>
    ),
  },
  {
    accessorKey: "media",
    header: "Media Attachments",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          {item.videoUrl && (
            <Badge variant="secondary" className="rounded-md text-[10px] gap-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Video className="w-3 h-3" /> Video
            </Badge>
          )}
          {item.diagramUrl && (
            <Badge variant="secondary" className="rounded-md text-[10px] gap-1 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              <FileCode className="w-3 h-3" /> Diagram
            </Badge>
          )}
          {!item.videoUrl && !item.diagramUrl && (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "reviewStatus",
    header: "Review Status",
    cell: ({ row }) => getReviewStatusBadge(row.original.reviewStatus),
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
            onClick={() => onReview(item)}
            className="rounded-xl h-8 px-3 text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            Review Solution
          </Button>
        </div>
      );
    },
  },
];
