import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function buildVisiblePages(
  pageNumbers: number[],
  currentPage: number,
  totalPages: number
) {
  if (totalPages <= 5) return pageNumbers;

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
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange: (value: number) => void;
  filteredCount: number;
};

export function ReportManagementPagination({
  rowsPerPage,
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange,
  filteredCount,
}: ReportManagementPaginationProps) {
  const visiblePages = buildVisiblePages(pageNumbers, currentPage, totalPages);
  const start = filteredCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, filteredCount);

  return (
    <footer className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        {start}-{end} of {filteredCount} reports
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>

        {visiblePages.map((pageNumber, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldRenderEllipsis =
            previousPage !== undefined && pageNumber - previousPage > 1;

          return (
            <div key={pageNumber} className="flex items-center gap-2">
              {shouldRenderEllipsis ? (
                <span className="px-1 text-sm font-medium text-slate-400">...</span>
              ) : null}
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="icon-sm"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "rounded-xl text-sm font-semibold",
                  currentPage === pageNumber
                    ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </nav>
    </footer>
  );
}
