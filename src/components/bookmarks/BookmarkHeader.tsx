"use client";

import Link from "next/link";
import { ChevronRight, Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type {
  BookmarkCategory,
  BookmarksResponse,
} from "@/lib/types/bookmarks/types";

interface BookmarkHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: BookmarkCategory;
  onCategoryChange: (category: BookmarkCategory) => void;
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  counts: BookmarksResponse["counts"];
  totalSavedCount: number;
  visibleCount: number;
}

const CATEGORIES: Array<{
  value: BookmarkCategory;
  label: string;
  countKey: keyof BookmarksResponse["counts"];
}> = [
  { value: "all", label: "All", countKey: "all" },
  { value: "Program", label: "Programs", countKey: "Program" },
  { value: "Problems", label: "Problems", countKey: "Problems" },
  { value: "Solutions", label: "Solutions", countKey: "Solutions" },
  { value: "Showcases", label: "Showcases", countKey: "Showcases" },
];

export function BookmarkHeader({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showMoreFilters,
  onToggleMoreFilters,
  counts,
  totalSavedCount,
  visibleCount,
}: BookmarkHeaderProps) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center dark:border-neutral-800">
        <div className="flex flex-col gap-1.5">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-neutral-400"
          >
            <Link
              href="/dashboard"
              className="transition-colors hover:text-slate-900 dark:hover:text-neutral-100"
            >
              Dashboard
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <span className="text-slate-700 dark:text-neutral-200">
              Bookmarks
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-neutral-100">
            Bookmarks
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400">
            Search and filter your saved programs and community posts.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          {visibleCount === totalSavedCount
            ? `${totalSavedCount} saved`
            : `${visibleCount} of ${totalSavedCount} shown`}
        </Badge>
      </header>

      <section
        aria-label="Bookmark search and filters"
        className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-lg items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
              />
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles and descriptions..."
                aria-label="Search bookmarks"
                className="h-10 rounded-xl border-slate-300 bg-white pl-10 text-sm shadow-2xs dark:border-neutral-700 dark:bg-neutral-950"
              />
            </div>
            {searchTerm ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => onSearchChange("")}
                aria-label="Clear bookmark search"
              >
                <X aria-hidden="true" />
              </Button>
            ) : null}
          </div>

          <Button
            type="button"
            variant={showMoreFilters ? "secondary" : "outline"}
            size="lg"
            onClick={onToggleMoreFilters}
            aria-expanded={showMoreFilters}
            aria-controls="bookmark-more-filters"
            className="rounded-xl"
          >
            <Filter data-icon="inline-start" />
            Sort options
          </Button>
        </div>

        <ToggleGroup
          multiple={false}
          value={[selectedCategory]}
          onValueChange={(values) => {
            const nextCategory = values.at(-1) as BookmarkCategory | undefined;
            if (nextCategory) onCategoryChange(nextCategory);
          }}
          spacing={1}
          aria-label="Filter bookmarks by type"
          className="max-w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-neutral-700 dark:bg-neutral-800/80"
        >
          {CATEGORIES.map((category) => (
            <ToggleGroupItem
              key={category.value}
              value={category.value}
              className="group h-9 cursor-pointer rounded-lg px-3 text-sm font-semibold text-slate-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:shadow-2xs dark:text-neutral-300"
            >
              <span>{category.label}</span>
              <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-xs tabular-nums group-data-[state=on]:bg-white/15 dark:bg-white/10">
                {counts[category.countKey]}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>
    </div>
  );
}
