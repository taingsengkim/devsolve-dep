"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { BookmarkCategory } from "@/lib/types/bookmarks/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookmarkHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: BookmarkCategory;
  onCategoryChange: (category: BookmarkCategory) => void;
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  totalSavedCount: number;
}

export const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showMoreFilters,
  onToggleMoreFilters,
  totalSavedCount,
}) => {
  return (
    <div className="space-y-6">
      {/* TITLE & DESCRIPTION */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
          Bookmarks
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your saved problems, solutions, and community content.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          {totalSavedCount} items saved
        </p>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your bookmarks..."
          className="pl-9 pr-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl h-10 text-sm focus-visible:ring-blue-500 shadow-2xs"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* FILTER PILLS & ACTION BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            type="button"
            onClick={() => onCategoryChange("Program")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all shadow-2xs cursor-pointer ${
              selectedCategory === "Program"
                ? "bg-blue-600 text-white border border-blue-600"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Program
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange("Problems")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all shadow-2xs cursor-pointer ${
              selectedCategory === "Problems"
                ? "bg-blue-600 text-white border border-blue-600"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Problems
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange("Solutions")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all shadow-2xs cursor-pointer ${
              selectedCategory === "Solutions"
                ? "bg-blue-600 text-white border border-blue-600"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Solutions
          </button>

          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 font-medium"
            >
              Show all ({totalSavedCount})
            </button>
          )}
        </div>

        {/* MORE FILTERS BUTTON */}
        <Button
          variant="outline"
          onClick={onToggleMoreFilters}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium h-9 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 ${
            showMoreFilters ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50" : ""
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          More Filters
        </Button>
      </div>
    </div>
  );
};
