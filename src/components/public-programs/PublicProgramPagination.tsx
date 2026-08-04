"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicProgramPaginationProps = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
};

export function PublicProgramPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}: PublicProgramPaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 lg:flex-row">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
        </select>
      </div>

      <nav className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ChevronLeft data-icon="inline-start" className="size-4" />
          Previous
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page)}
            className={cn(
              "rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              currentPage === page && "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
            )}
          >
            {page}
          </Button>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          Next
          <ChevronRight data-icon="inline-end" className="size-4" />
        </Button>
      </nav>
    </footer>
  );
}
