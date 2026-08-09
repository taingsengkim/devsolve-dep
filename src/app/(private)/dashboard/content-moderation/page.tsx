"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Flag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ArrowLeft,
  History,
  LayoutTemplate,
  MessageSquareWarning,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetContentReportsQuery,
  useUpdateContentReportActionMutation,
  type ContentReportItem,
} from "@/lib/redux/services/admin/moderationApi";
import { useContentReportFilters } from "@/hooks/useContentReportFilters";
import { ContentReportCard } from "@/components/admin/ContentReportCard";
import { ReportReasonsBreakdown } from "@/components/admin/ReportReasonsBreakdown";
import { ModerationActionDialog } from "@/components/admin/ModerationActionDialog";
import { ModerationHistoryTable } from "@/components/admin/ModerationHistoryTable";
import { ShowcaseReviewQueue } from "@/components/admin/showcases/ShowcaseReviewQueue";
import { ProblemReviewQueue } from "@/components/admin/problems/ProblemReviewQueue";
import { useGetShowcaseReviewQueueQuery } from "@/lib/redux/services/admin/showcaseReviewApi";
import { useGetProblemReviewQueueQuery } from "@/lib/redux/services/admin/problemReviewApi";
import { FlagDetailSheet } from "@/components/admin/FlagDetailSheet";
import type { ModerationActionType } from "@/lib/types/admin/types";
import { cn } from "@/lib/utils";

/**
 * Four jobs share this screen, and each is a different question. Flags are
 * raised against content that is already public; a showcase or a problem is
 * not public until it is approved; the history is a record rather than a
 * queue. They live together because one person does all four, and the tab row
 * carries every backlog at once so none of them is discovered by accident.
 */

type TabId = "queue" | "showcases" | "problems" | "history";

const TABS: {
  value: TabId;
  label: string;
  icon: LucideIcon;
  blurb: string;
}[] = [
  {
    value: "queue",
    label: "Reports",
    icon: ShieldAlert,
    blurb:
      "Content the community flagged. It is already public, so acting here takes something down or warns its author.",
  },
  {
    value: "showcases",
    label: "Showcases",
    icon: LayoutTemplate,
    blurb:
      "Showcase submissions waiting on a decision. Nothing here is public until it is approved.",
  },
  {
    value: "problems",
    label: "Problems",
    icon: MessageSquareWarning,
    blurb:
      "Problems waiting on a decision. Approving one publishes it to the feed, open for solutions.",
  },
  {
    value: "history",
    label: "History",
    icon: History,
    blurb: "Every moderation action taken, with who took it and when.",
  },
];

export default function ContentManagementPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ContentManagement />
    </Suspense>
  );
}

function ContentManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* The tab lives in the URL so a refresh, a bookmark, or the back arrow out
     of a review detail page all land where the reviewer left off. */
  const activeTab = useMemo<TabId>(() => {
    const param = searchParams.get("tab") as TabId | null;
    return param && TABS.some((tab) => tab.value === param) ? param : "queue";
  }, [searchParams]);

  const selectTab = useCallback(
    (tab: TabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const { data, isLoading } = useGetContentReportsQuery();
  const [updateAction] = useUpdateContentReportActionMutation();

  /* Both approval queues are asked for a single row: the response is fetched
     for its total, which is what the tab badge shows. */
  const { data: showcaseQueue } = useGetShowcaseReviewQueueQuery({
    reviewStatus: "PENDING",
    pageSize: 1,
  });
  const { data: problemQueue } = useGetProblemReviewQueueQuery({
    status: "PENDING_APPROVAL",
    size: 1,
  });

  const reportsList = useMemo(() => data?.items ?? [], [data]);
  const breakdown = data?.breakdown;

  const pendingReports = useMemo(
    () => reportsList.filter((report) => report.status === "PENDING").length,
    [reportsList],
  );

  const counts: Record<TabId, number | undefined> = {
    queue: pendingReports,
    showcases: showcaseQueue?.totalElements ?? 0,
    problems: problemQueue?.totalElements ?? 0,
    history: undefined,
  };

  const {
    typeFilter,
    reasonFilter,
    sortBy,
    searchQuery,
    currentPage,
    rowsPerPage,
    setTypeFilter,
    setReasonFilter,
    setSortBy,
    setSearchQuery,
    setCurrentPage,
    setRowsPerPage,
    resetFilters,
    filteredReports,
    paginatedReports,
    totalFiltered,
    totalPages,
  } = useContentReportFilters(reportsList);

  // Modal State for Moderation Actions
  const [dialogReport, setDialogReport] = useState<ContentReportItem | null>(
    null,
  );
  const [dialogActionType, setDialogActionType] =
    useState<ModerationActionType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);

  const handleAction = (id: string, action: "DISMISS" | "WARN" | "REMOVE") => {
    if (action === "DISMISS") {
      updateAction({ id, action: "DISMISS" });
    } else {
      const found = reportsList.find((r) => r.id === id);
      if (found) {
        setDialogReport(found);
        setDialogActionType(action);
        setIsDialogOpen(true);
      }
    }
  };

  const handleConfirmModalAction = (
    id: string,
    action: ModerationActionType,
  ) => {
    updateAction({ id, action });
  };

  const contentTypeOptions = [
    { label: "All Types", value: "ALL" },
    { label: "Solutions", value: "SOLUTION" },
    { label: "Problems", value: "PROBLEM" },
    { label: "Comments", value: "COMMENT" },
    { label: "Programs", value: "PROGRAM" },
  ];

  const reasonOptions = [
    { label: "All Reasons", value: "ALL" },
    { label: "Spam", value: "Spam" },
    { label: "Harmful", value: "Harmful" },
    { label: "Offensive", value: "Offensive" },
    { label: "Off-topic", value: "Off-topic" },
  ];

  const sortOptions = [
    { label: "Most Reported", value: "MOST_REPORTED" },
    { label: "Newest First", value: "NEWEST" },
    { label: "Oldest First", value: "OLDEST" },
  ] as const;

  const hasFilters =
    typeFilter !== "ALL" || reasonFilter !== "ALL" || searchQuery.trim() !== "";

  const activeBlurb =
    TABS.find((tab) => tab.value === activeTab)?.blurb ?? TABS[0].blurb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Content Management
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
          Content Management
        </h1>
        {/* The subtitle follows the tab: one line about the job in front of
            you beats one line about all four. */}
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {activeBlurb}
        </p>
      </header>

      {/* ── Section switcher ───────────────────────────────────────────
          Its own full-width row rather than a corner of the header: with
          four sections the header version ran out of room, and the counts
          are worth seeing without clicking through. */}
      <nav
        aria-label="Moderation sections"
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-1.5 sm:flex sm:items-stretch dark:border-slate-800 dark:bg-slate-900/60"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const count = counts[tab.value];
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => selectTab(tab.value)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4",
                isActive
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-400",
                )}
              />
              <span className="truncate">{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "min-w-5 shrink-0 rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {activeTab === "queue" ? (
        <>
          {/* ── Filter & sort toolbar ── */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-900">
            {/* Content type pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {contentTypeOptions.map((opt) => {
                const isActive = typeFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTypeFilter(opt.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-xl border px-4 py-1.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Search, reason, sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  aria-label="Search reports"
                  className="h-9 rounded-xl border-slate-300 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 cursor-pointer rounded-xl border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    />
                  }
                >
                  <SlidersHorizontal
                    data-icon="inline-start"
                    className="text-slate-400"
                  />
                  <span>
                    Reason: {reasonFilter === "ALL" ? "All" : reasonFilter}
                  </span>
                  <ChevronDown
                    data-icon="inline-end"
                    className="text-slate-400"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {reasonOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setReasonFilter(opt.value)}
                        className={
                          reasonFilter === opt.value
                            ? "font-semibold text-slate-900 dark:text-slate-100"
                            : ""
                        }
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 cursor-pointer rounded-xl border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    />
                  }
                >
                  <span className="font-normal text-slate-400">Sort:</span>
                  <span>
                    {sortOptions.find((s) => s.value === sortBy)?.label ||
                      "Most Reported"}
                  </span>
                  <ChevronDown
                    data-icon="inline-end"
                    className="text-slate-400"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {sortOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={
                          sortBy === opt.value
                            ? "font-semibold text-slate-900 dark:text-slate-100"
                            : ""
                        }
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 cursor-pointer rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <RotateCcw data-icon="inline-start" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* ── Reports and the reason breakdown ── */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800"
                    />
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Flag className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {pendingReports === 0
                        ? "Nothing flagged right now"
                        : "No reports match your filters"}
                    </h3>
                    <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">
                      {pendingReports === 0
                        ? "Every flagged post and comment has been reviewed and resolved."
                        : "No pending reports matched the filters you applied."}
                    </p>
                  </div>
                  {pendingReports > 0 && (
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="h-9 cursor-pointer rounded-xl border-slate-300 text-xs font-semibold dark:border-slate-700"
                    >
                      <RotateCcw className="mr-1.5 size-3.5" /> Clear Filters
                    </Button>
                  )}
                </Card>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {paginatedReports.map((report) => (
                      <motion.div
                        key={report.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ContentReportCard
                          report={report}
                          onAction={handleAction}
                          onViewDetail={(id) => setSelectedFlagId(id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {totalFiltered > 0 && (
                    <div className="flex flex-col justify-between gap-4 border-t border-slate-200/80 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span id="report-rows-per-page">Rows per page</span>
                        <div className="w-20">
                          <Select
                            value={String(rowsPerPage)}
                            onValueChange={(val: string | null) => {
                              if (val) setRowsPerPage(Number(val));
                            }}
                          >
                            <SelectTrigger
                              aria-labelledby="report-rows-per-page"
                              className="h-8 rounded-xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-900"
                            >
                              <SelectValue placeholder={String(rowsPerPage)} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="ml-2 text-slate-400">
                          Showing {(currentPage - 1) * rowsPerPage + 1}–
                          {Math.min(currentPage * rowsPerPage, totalFiltered)}{" "}
                          of {totalFiltered} items
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-center sm:self-auto">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage(Math.max(currentPage - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="flex cursor-pointer items-center gap-1 font-medium text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                          <ChevronLeft className="size-4" />
                          Previous
                        </button>

                        {/* Windowed rather than one button per page: at 50
                            rows a page the old list stayed short, at 10 it
                            grew past the width of the column. */}
                        {pageWindow(currentPage, totalPages).map((item, i) =>
                          item === "gap" ? (
                            <span
                              key={`gap-${i}`}
                              aria-hidden="true"
                              className="px-1 text-slate-400"
                            >
                              …
                            </span>
                          ) : (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setCurrentPage(item)}
                              aria-current={
                                currentPage === item ? "page" : undefined
                              }
                              className={cn(
                                "flex size-7 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition",
                                currentPage === item
                                  ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                              )}
                            >
                              {item}
                            </button>
                          ),
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage(Math.min(currentPage + 1, totalPages))
                          }
                          disabled={currentPage === totalPages}
                          className="flex cursor-pointer items-center gap-1 font-medium text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                          Next
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="lg:sticky lg:top-6 lg:col-span-4">
              {breakdown && (
                <ReportReasonsBreakdown
                  breakdown={breakdown}
                  activeReasonFilter={reasonFilter}
                  onSelectReason={setReasonFilter}
                />
              )}
            </div>
          </div>

          <ModerationActionDialog
            report={dialogReport}
            actionType={dialogActionType}
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setDialogReport(null);
              setDialogActionType(null);
            }}
            onConfirm={handleConfirmModalAction}
          />

          {/* Flag Detail Side Drawer */}
          <FlagDetailSheet
            flagId={selectedFlagId}
            isOpen={Boolean(selectedFlagId)}
            onClose={() => setSelectedFlagId(null)}
            onAction={handleAction}
          />
        </>
      ) : activeTab === "showcases" ? (
        <ShowcaseReviewQueue />
      ) : activeTab === "problems" ? (
        <ProblemReviewQueue />
      ) : (
        <ModerationHistoryTable />
      )}
    </motion.div>
  );
}

/**
 * The page numbers worth rendering: the ends, the current page and its
 * neighbours, with a gap marker standing in for the rest.
 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2)
    [total - 3, total - 2, total - 1].forEach((page) => pages.add(page));

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) items.push("gap");
    items.push(page);
    previous = page;
  }
  return items;
}

/** Matches the page's own shape, so the tab row does not jump in on load. */
function PageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading content management"
      className="w-full animate-pulse space-y-6 pb-12"
    >
      <span className="sr-only">Loading content management…</span>
      <div className="space-y-2">
        <div className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-72 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full max-w-2xl rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-16 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200 lg:col-span-4 dark:bg-slate-800" />
      </div>
    </div>
  );
}
