"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookmarkCategory } from "@/lib/types/bookmarks/types";
import { useGetBookmarksQuery, useRemoveBookmarkMutation } from "@/lib/redux/services/bookmarksApi";
import { BookmarkHeader } from "@/components/bookmarks/BookmarkHeader";
import { BookmarkFiltersBar } from "@/components/bookmarks/BookmarkFiltersBar";
import { BookmarkCard } from "@/components/bookmarks/BookmarkCard";
import { Bookmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BookmarkCategory>("Problems"); // Default selected tab as in reference screenshot
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  // RTK Query data fetching
  const { data: bookmarksResponse, isLoading, isFetching } = useGetBookmarksQuery({
    category: selectedCategory,
    search: searchTerm,
    severity: selectedSeverity,
    sortBy,
  });

  const [removeBookmark] = useRemoveBookmarkMutation();

  const bookmarks = bookmarksResponse?.data || [];
  const totalSavedCount = bookmarksResponse?.totalCount || 0;

  const isFilterActive =
    searchTerm !== "" || selectedSeverity !== "All" || sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSeverity("All");
    setSortBy("newest");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* HEADER WITH SEARCH & CATEGORY PILLS */}
      <BookmarkHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showMoreFilters={showMoreFilters}
        onToggleMoreFilters={() => setShowMoreFilters(!showMoreFilters)}
        totalSavedCount={totalSavedCount}
      />

      {/* EXPANDABLE ADVANCED FILTERS PANEL */}
      <AnimatePresence>
        {showMoreFilters && (
          <BookmarkFiltersBar
            sortBy={sortBy}
            onSortByChange={setSortBy}
            selectedSeverity={selectedSeverity}
            onSeverityChange={setSelectedSeverity}
            onResetFilters={handleResetFilters}
            isFilterActive={isFilterActive}
          />
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="pt-2">
        {isLoading || isFetching ? (
          /* SKELETON LOADING STATE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-20" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
                <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-2xs"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bookmark className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                No bookmarks found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                {isFilterActive
                  ? "No saved items match your current filter or search criteria. Try clearing filters or changing search keywords."
                  : "You haven't saved any items yet. Bookmark programs, problems, or solutions to quickly access them here."}
              </p>
            </div>
            {isFilterActive && (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="rounded-xl border-slate-300 dark:border-slate-700 font-semibold gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </motion.div>
        ) : (
          /* BOOKMARK CARDS GRID */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {bookmarks.map((item) => (
                <BookmarkCard
                  key={item.id}
                  item={item}
                  onRemove={(id) => removeBookmark(id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
