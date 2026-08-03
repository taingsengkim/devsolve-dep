"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiscussionPaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}

export function DiscussionPagination({
  page,
  totalPages,
  limit,
  totalCount,
  onPageChange,
  onLimitChange,
}: DiscussionPaginationProps) {
  // Build page number array with ellipsis
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  if (totalCount === 0) return null;

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2 text-base text-slate-700 font-medium">
        <span>Rows per page</span>
        <Select
          value={String(limit)}
          onValueChange={(val) => {
            if (val) {
              onLimitChange(Number(val));
              onPageChange(1);
            }
          }}
        >
          <SelectTrigger className="rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-800 h-9 px-3 min-w-[70px]">
            <SelectValue placeholder={String(limit)} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-md rounded-xl">
            {[3, 5, 10, 20].map((n) => (
              <SelectItem key={n} value={String(n)} className="text-base font-medium cursor-pointer">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-2xs"
        >
          <ChevronLeft className="size-4 stroke-[2.5]" />
          Previous
        </motion.button>

        <div className="flex gap-1.5">
          {getPages().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-base text-slate-500 font-bold">
                …
              </span>
            ) : (
              <motion.button
                key={p}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPageChange(Number(p))}
                className={`h-9 w-9 rounded-xl text-base font-bold transition-colors ${
                  page === p
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {p}
              </motion.button>
            )
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-2xs"
        >
          Next
          <ChevronRight className="size-4 stroke-[2.5]" />
        </motion.button>
      </div>
    </div>
  );
}
