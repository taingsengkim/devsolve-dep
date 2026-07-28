"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgramPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  displayedCount: number;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  onPageChange: (page: number) => void;
}

export const ProgramPagination: React.FC<ProgramPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  displayedCount,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}) => {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <label htmlFor="rows-per-page" className="font-medium">
          Rows per page
        </label>
        <select
          id="rows-per-page"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="h-9 px-3 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="6">6</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <span className="text-xs text-slate-400 ml-2">
          Showing {displayedCount} of {totalCount} programs
        </span>
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Pagination Navigation">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-9 px-3 rounded-xl border-slate-300 text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={`h-9 w-9 rounded-xl text-sm font-semibold cursor-pointer ${
              currentPage === pageNum
                ? "bg-blue-600 text-white shadow-2xs"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNum}
          </Button>
        ))}

        {totalPages > 3 && currentPage < totalPages - 1 && (
          <span className="px-1 text-slate-400 text-sm">...</span>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="h-9 px-3 rounded-xl border-slate-300 text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </nav>
    </footer>
  );
};
