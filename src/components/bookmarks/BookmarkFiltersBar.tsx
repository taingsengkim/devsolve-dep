"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookmarkFiltersBarProps {
  sortBy: "newest" | "oldest" | "title";
  onSortByChange: (sort: "newest" | "oldest" | "title") => void;
  onResetFilters: () => void;
  isFilterActive: boolean;
}

export function BookmarkFiltersBar({
  sortBy,
  onSortByChange,
  onResetFilters,
  isFilterActive,
}: BookmarkFiltersBarProps) {
  return (
    <motion.div
      id="bookmark-more-filters"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-neutral-100">
            <SlidersHorizontal aria-hidden="true" className="size-4 text-blue-600 dark:text-blue-400" />
            Sort bookmarks
          </div>

          {isFilterActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
            >
              <RotateCcw data-icon="inline-start" />
              Reset filters
            </Button>
          ) : null}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="bookmark-sort">Sort by</Label>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value) {
                onSortByChange(value as "newest" | "oldest" | "title");
              }
            }}
          >
            <SelectTrigger
              id="bookmark-sort"
              className="h-10 w-full rounded-xl border-slate-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"
            >
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="newest">Recently saved</SelectItem>
                <SelectItem value="oldest">Oldest saved</SelectItem>
                <SelectItem value="title">Title (A–Z)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
