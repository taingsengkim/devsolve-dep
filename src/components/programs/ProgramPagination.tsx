"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <label htmlFor="rows-per-page" className="font-medium text-foreground">
          Rows per page
        </label>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(val) => onRowsPerPageChange(Number(val))}
        >
          <SelectTrigger
            id="rows-per-page"
            className="h-9 px-3 rounded-xl bg-muted/60 text-sm font-semibold text-foreground shadow-2xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <SelectValue placeholder={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg min-w-[72px] p-1">
            {[6, 10, 20, 50].map((num) => (
              <SelectItem
                key={num}
                value={String(num)}
                className="rounded-lg cursor-pointer py-1.5 px-2.5 text-sm font-medium hover:bg-muted"
              >
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground font-medium ml-2">
          Showing {displayedCount} of {totalCount} programs
        </span>
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Pagination Navigation">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-9 px-3 rounded-xl text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
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
              currentPage === pageNum ? "bg-blue-600 text-white shadow-2xs" : ""
            }`}
          >
            {pageNum}
          </Button>
        ))}

        {totalPages > 3 && currentPage < totalPages - 1 && (
          <span className="px-1 text-muted-foreground text-sm">...</span>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="h-9 px-3 rounded-xl text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </nav>
    </footer>
  );
};
