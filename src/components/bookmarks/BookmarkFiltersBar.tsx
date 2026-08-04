"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "motion/react";

interface BookmarkFiltersBarProps {
  sortBy: "newest" | "oldest" | "title";
  onSortByChange: (sort: "newest" | "oldest" | "title") => void;
  selectedSeverity: string;
  onSeverityChange: (sev: string) => void;
  onResetFilters: () => void;
  isFilterActive: boolean;
}

export const BookmarkFiltersBar: React.FC<BookmarkFiltersBarProps> = ({
  sortBy,
  onSortByChange,
  selectedSeverity,
  onSeverityChange,
  onResetFilters,
  isFilterActive,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Refine Bookmarks
          </div>

          {isFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 h-7 px-2 gap-1 rounded-lg"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* SORT BY */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={(val) => { if (val) onSortByChange(val as "newest" | "oldest" | "title"); }}>
              <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-9 text-xs">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Recently Saved</SelectItem>
                <SelectItem value="oldest">Oldest Saved</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SEVERITY FILTER */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Problem Severity
            </label>
            <Select value={selectedSeverity} onValueChange={(val) => onSeverityChange(val ?? "All")}>
              <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-9 text-xs">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
