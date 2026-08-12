"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 lg:flex-row">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(val) => onRowsPerPageChange(Number(val))}
        >
          <SelectTrigger className="h-9 w-[70px] rounded-xl border-border bg-card text-foreground">
            <SelectValue placeholder={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="16">16</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <nav className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
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
              "rounded-full border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              currentPage === page && "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-blue-600"
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
          className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Next
          <ChevronRight data-icon="inline-end" className="size-4" />
        </Button>
      </nav>
    </footer>
  );
}
