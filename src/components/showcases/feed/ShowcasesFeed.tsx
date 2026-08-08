"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, LayoutGrid, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiscussionEmptyState } from "@/components/discussions/DiscussionEmptyState";
import {
  DiscussionHeader,
  DiscussionSearch,
} from "@/components/discussions/DiscussionHeader";
import { DiscussionPagination } from "@/components/discussions/DiscussionPagination";
import { ShowcaseCard } from "@/components/showcases/feed/ShowcaseCard";
import { useGetActiveCategoriesQuery } from "@/lib/redux/services/categoriesApi";
import { useGetShowcasesQuery } from "@/lib/redux/services/showcasesApi";
import { cn } from "@/lib/utils";

/**
 * The public showcase index, served by `GET /api/v1/showcases`.
 *
 * Filtering, sorting and paging are all the upstream's: `query`, `categoryId`,
 * `sortBy`/`sortDirection` and `pageNumber`/`pageSize` go over the wire rather
 * than being applied to a page of results after the fact, so what the feed
 * shows is the whole matching set and the count under the tabs is real.
 */

/** Sort choices, each mapped onto a column the list endpoint accepts. */
const SORTS = [
  {
    value: "newest",
    label: "Newest",
    sortBy: "createdAt",
    sortDirection: "DESC",
  },
  {
    value: "oldest",
    label: "Oldest",
    sortBy: "createdAt",
    sortDirection: "ASC",
  },
  {
    value: "updated",
    label: "Recently updated",
    sortBy: "updatedAt",
    sortDirection: "DESC",
  },
  {
    value: "viewed",
    label: "Most viewed",
    sortBy: "viewCount",
    sortDirection: "DESC",
  },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

const DEFAULT_PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

export function ShowcasesFeed() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortValue>("newest");
  /** 1-based for the pager; the endpoint counts from 0. */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  /* `searchInput` drives the field (instant); `searchQuery` drives the request
     (debounced) so typing doesn't fire one per keystroke. */
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === searchQuery) return;
    const timeout = setTimeout(() => {
      setSearchQuery(trimmed);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, searchQuery]);

  const sortOption = SORTS.find((option) => option.value === sort) ?? SORTS[0];

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetShowcasesQuery({
    query: searchQuery || undefined,
    categoryId: categoryId ?? undefined,
    sortBy: sortOption.sortBy,
    sortDirection: sortOption.sortDirection,
    pageNumber: page - 1,
    pageSize,
  });

  /* Categories are public metadata, but the chips are optional furniture: if
     the request fails there is nothing to filter by and the row simply goes. */
  const { data: categories = [] } = useGetActiveCategoriesQuery("SHOWCASE");

  const showcases = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const isInitialLoading = isLoading && !data;
  const isSearchPending =
    searchInput.trim() !== searchQuery || (isFetching && !isInitialLoading);
  const hasActiveFilters = searchQuery !== "" || categoryId !== null;

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setCategoryId(null);
    setSort("newest");
    setPage(1);
  }, []);

  const selectCategory = useCallback((next: string | null) => {
    setCategoryId(next);
    setPage(1);
  }, []);

  const feedRef = useRef<HTMLElement>(null);
  const previousPage = useRef(page);

  useEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[100dvh] bg-muted/30 text-foreground"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <DiscussionHeader
          breadcrumbLabel="Showcases"
          title="Showcases"
          badgeLabel="Ship · Share · Inspire"
          description="Projects the community built, each with the guide that made it work."
          createHref="/community/create/showcase"
          createLabel="Post a showcase"
        />

        <section
          aria-label="Search and sort showcases"
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <DiscussionSearch
                searchQuery={searchInput}
                onSearch={setSearchInput}
                onClearSearch={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setPage(1);
                }}
                isSearching={isSearchPending}
                label="Search showcases"
                placeholder="Search showcases by title or overview..."
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                id="showcases-sort-label"
                className="text-sm font-medium text-muted-foreground"
              >
                Sort
              </span>
              <Select
                value={sort}
                onValueChange={(value) => {
                  if (!value) return;
                  setSort(value as SortValue);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  aria-labelledby="showcases-sort-label"
                  className="h-11 min-w-44 rounded-xl bg-card text-base font-semibold"
                >
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {SORTS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-base"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category chips, from the real showcase-scoped category list. */}
          {categories.length > 0 && (
            <div
              role="group"
              aria-label="Filter by category"
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-card p-2 shadow-xs ring-1 ring-foreground/5"
            >
              <CategoryChip
                active={categoryId === null}
                onClick={() => selectCategory(null)}
              >
                <LayoutGrid aria-hidden="true" className="size-4" />
                All
              </CategoryChip>
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  active={categoryId === category.id}
                  onClick={() => selectCategory(category.id)}
                >
                  {category.name}
                </CategoryChip>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 px-1">
            <p
              aria-live="polite"
              className="text-sm font-medium text-muted-foreground"
            >
              <span className="font-semibold tabular-nums text-foreground">
                {totalCount.toLocaleString()}
              </span>{" "}
              {totalCount === 1 ? "showcase" : "showcases"}
              {hasActiveFilters ? " match your filters" : " published"}
            </p>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl"
              >
                <RotateCcw data-icon="inline-start" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>
        </section>

        <section
          ref={feedRef}
          aria-label="Showcase feed"
          className="flex scroll-mt-6 flex-col gap-5"
        >
          {isError ? (
            <FeedError
              message={messageOf(
                error,
                "Showcases could not be loaded right now.",
              )}
              onRetry={() => void refetch()}
            />
          ) : isInitialLoading ? (
            <FeedSkeleton count={Math.min(pageSize, 4)} />
          ) : (
            <>
              <div
                aria-busy={isFetching}
                className={cn(
                  "transition-opacity duration-150",
                  isFetching && "opacity-70",
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showcases.length > 0 ? (
                    <motion.div
                      key={`feed-${categoryId}-${searchQuery}-${sort}-${page}-${pageSize}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                    >
                      {showcases.map((showcase, index) => (
                        <ShowcaseCard
                          key={showcase.id}
                          showcase={showcase}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <DiscussionEmptyState
                        onReset={resetFilters}
                        hasFilters={hasActiveFilters}
                        createHref="/community/create/showcase"
                        emptyLabel="No showcases found"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {totalCount > 0 && (
                <DiscussionPagination
                  page={page}
                  totalPages={Math.max(1, totalPages)}
                  limit={pageSize}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onLimitChange={(next) => {
                    setPageSize(next);
                    setPage(1);
                  }}
                  pageSizeOptions={[6, 12, 24]}
                  label="Showcase pagination"
                />
              )}
            </>
          )}
        </section>
      </div>
    </motion.div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Matches the card's shape — cover block, two badges, title, body, footer. */
function FeedSkeleton({ count }: { count: number }) {
  return (
    <div
      role="status"
      aria-label="Loading showcases"
      className="grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <span className="sr-only">Loading showcases…</span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl bg-card shadow-xs ring-1 ring-foreground/5"
        >
          <div className="aspect-[16/8] bg-muted" />
          <div className="flex flex-col gap-3 p-5">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-lg bg-muted" />
              <div className="h-6 w-16 rounded-lg bg-muted" />
            </div>
            <div className="h-6 w-4/5 rounded-lg bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full rounded-lg bg-muted" />
              <div className="h-4 w-2/3 rounded-lg bg-muted" />
            </div>
            <div className="mt-1 flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-muted" />
              <div className="h-4 w-28 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-10 text-center shadow-xs ring-1 ring-foreground/5">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
        <AlertCircle aria-hidden="true" className="size-7" />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>
      <Button type="button" size="lg" onClick={onRetry} className="rounded-xl">
        <RotateCcw data-icon="inline-start" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}

/** Pulls something readable out of an RTK Query error. */
function messageOf(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data) return data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message) return message;
    }
  }
  return fallback;
}
