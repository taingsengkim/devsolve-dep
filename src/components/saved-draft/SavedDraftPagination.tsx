import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SavedDraftPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPagination(currentPage: number, totalPages: number) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3];
  }

  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 1, currentPage, currentPage + 1];
}

export function SavedDraftPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SavedDraftPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPagination(currentPage, totalPages);

  return (
    <footer className="flex flex-col items-center justify-between gap-4 pt-1 sm:flex-row">
      <span className="text-sm text-[#64748B]">
        Page {currentPage} of {totalPages}
      </span>

      <nav className="flex items-center gap-1.5" aria-label="Saved draft pagination">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-xl px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ChevronLeft data-icon="inline-start" className="size-4" />
          Previous
        </Button>

        {pages[0] > 1 && (
          <>
            <PaginationPageButton
              page={1}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
            {pages[0] > 2 && <MoreHorizontal className="mx-1 size-4 text-slate-300" />}
          </>
        )}

        {pages.map((page) => (
          <PaginationPageButton
            key={page}
            page={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <MoreHorizontal className="mx-1 size-4 text-slate-300" />
            )}
            <PaginationPageButton
              page={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-xl px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          Next
          <ChevronRight data-icon="inline-end" className="size-4" />
        </Button>
      </nav>
    </footer>
  );
}

type PaginationPageButtonProps = {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function PaginationPageButton({
  page,
  currentPage,
  onPageChange,
}: PaginationPageButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={() => onPageChange(page)}
      className={cn(
        "rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        currentPage === page &&
          "border-blue-600 bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
      )}
    >
      {page}
    </Button>
  );
}
