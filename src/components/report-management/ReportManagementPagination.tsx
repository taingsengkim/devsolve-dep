import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function buildVisiblePages(
  pageNumbers: number[],
  currentPage: number,
  totalPages: number
) {
  if (totalPages <= 7) return pageNumbers;

  const visiblePages = new Set<number>([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  return pageNumbers.filter((pageNumber) => visiblePages.has(pageNumber));
}

type ReportManagementPaginationProps = {
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange: (value: number) => void;
};

export function ReportManagementPagination({
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange,
}: ReportManagementPaginationProps) {
  const visiblePages = buildVisiblePages(pageNumbers, currentPage, totalPages);

  return (
    <footer className="flex flex-col gap-4 rounded-4xl border border-slate-200/80 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <label
          htmlFor="rows-per-page"
          className="text-sm font-medium text-slate-500"
        >
          Rows per page
        </label>
        <select
          id="rows-per-page"
          value={rowsPerPage}
          onChange={(event) => {
            onRowsPerPageChange(Number(event.target.value));
            onPageChange(1);
          }}
          className="h-9 rounded-3xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          {[10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-full"
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>

        {visiblePages.map((pageNumber, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldRenderEllipsis =
            previousPage !== undefined && pageNumber - previousPage > 1;

          return (
            <div key={pageNumber} className="flex items-center gap-2">
              {shouldRenderEllipsis && (
                <span className="px-1 text-sm text-slate-400">...</span>
              )}
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full",
                  currentPage !== pageNumber && "bg-white text-slate-600"
                )}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="rounded-full"
        >
          Next
          <ChevronRight data-icon="inline-end" />
        </Button>
      </nav>
    </footer>
  );
}
