"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
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
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/lib/redux/services/adminApi";
import { useContentReportFilters } from "@/hooks/useContentReportFilters";
import { ContentReportCard } from "@/components/admin/ContentReportCard";
import { ReportReasonsBreakdown } from "@/components/admin/ReportReasonsBreakdown";
import { ModerationActionDialog } from "@/components/admin/ModerationActionDialog";
import { ModerationHistoryTable } from "@/components/admin/ModerationHistoryTable";
import { ShowcaseReviewQueue } from "@/components/admin/showcases/ShowcaseReviewQueue";
import { useGetShowcaseReviewQueueQuery } from "@/lib/redux/services/admin/showcaseReviewApi";
import type { ModerationActionType } from "@/lib/types/admin/types";
import { cn } from "@/lib/utils";

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "showcases" | "history">(
    "queue",
  );

  const { data, isLoading } = useGetContentReportsQuery();
  const [updateAction] = useUpdateContentReportActionMutation();

  /* Two different jobs share this page: flags are raised against content that
     is already public, while a showcase submission is not public until it is
     approved. The count rides on the tab so a waiting queue is visible from
     the flags view. */
  const { data: showcaseQueue } = useGetShowcaseReviewQueueQuery({
    reviewStatus: "PENDING",
    pageSize: 1,
  });
  const pendingShowcases = showcaseQueue?.totalElements ?? 0;

  const reportsList = data?.items ?? [];
  const breakdown = data?.breakdown;

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
  const [dialogReport, setDialogReport] = useState<ContentReportItem | null>(null);
  const [dialogActionType, setDialogActionType] = useState<ModerationActionType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleConfirmModalAction = (id: string, action: ModerationActionType) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* 1. Page Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Content Management
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Content Management
            </h1>
            {breakdown && (
              <Badge variant="secondary" className="rounded-full tabular-nums">
                {breakdown.total} pending reports
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review community-flagged submissions, manage user safety actions, and inspect historical audit logs.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex max-w-full shrink-0 items-center gap-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "queue"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
            )}
          >
            <ShieldAlert className="size-4 text-slate-500" />
            Reports Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("showcases")}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "showcases"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
            )}
          >
            <LayoutTemplate className="size-4 text-slate-500" />
            Showcase Approvals
            {pendingShowcases > 0 && (
              <Badge variant="secondary" className="min-w-5 rounded-full px-1.5 tabular-nums">
                {pendingShowcases}
              </Badge>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
            )}
          >
            <History className="size-4 text-slate-500" />
            Moderation History
          </button>
        </div>
      </header>

      {activeTab === "queue" ? (
        <>
          {/* 2. Interactive Filter & Sort Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            {/* Left Side: Content Type Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {contentTypeOptions.map((opt) => {
                const isActive = typeFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTypeFilter(opt.value)}
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

            {/* Right Side: Reason Dropdown, Sort Dropdown & Search Input */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="h-9 rounded-xl border-slate-300 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              {/* Reason Filter Dropdown */}
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
                  <SlidersHorizontal data-icon="inline-start" className="text-slate-400" />
                  <span>
                    Reason: {reasonFilter === "ALL" ? "All" : reasonFilter}
                  </span>
                  <ChevronDown data-icon="inline-end" className="text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {reasonOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setReasonFilter(opt.value)}
                        className={reasonFilter === opt.value ? "font-semibold text-slate-900 dark:text-slate-100" : ""}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
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
                  <span className="font-normal text-slate-400">
                    Sort:
                  </span>
                  <span>
                    {sortOptions.find((s) => s.value === sortBy)?.label || "Most Reported"}
                  </span>
                  <ChevronDown data-icon="inline-end" className="text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {sortOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={sortBy === opt.value ? "font-semibold text-slate-900 dark:text-slate-100" : ""}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Filters Button */}
              {(typeFilter !== "ALL" || reasonFilter !== "ALL" || searchQuery.trim() !== "") && (
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

          {/* 3. Asymmetric 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Report Cards List */}
            <div className="lg:col-span-8 space-y-4">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl"
                    />
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
                  <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Flag className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      No flagged content matches your filters
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {reportsList.filter((r) => r.status === "PENDING").length === 0
                        ? "Awesome job! All flagged community posts and comments have been reviewed and resolved."
                        : "No pending reports matched your currently applied filter controls."}
                    </p>
                  </div>
                  {reportsList.filter((r) => r.status === "PENDING").length > 0 && (
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="rounded-xl font-semibold border-slate-300 dark:border-slate-700 cursor-pointer h-9 text-xs"
                    >
                      <RotateCcw className="size-3.5 mr-1.5" /> Clear Filters
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
                        <ContentReportCard report={report} onAction={handleAction} />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Integrated Pagination Controls */}
                  {totalFiltered > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <div className="w-20">
                          <Select
                            value={String(rowsPerPage)}
                            onValueChange={(val: string | null) => {
                              if (val) setRowsPerPage(Number(val));
                            }}
                          >
                            <SelectTrigger className="h-8 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold">
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
                          {Math.min(currentPage * rowsPerPage, totalFiltered)} of {totalFiltered} items
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-center sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                        >
                          <ChevronLeft className="size-4" />
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`size-7 rounded-full font-bold text-xs flex items-center justify-center cursor-pointer transition ${
                              currentPage === pageNum
                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
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

            {/* Right Column: Report Reasons Breakdown Sidebar */}
            <div className="lg:col-span-4 sticky top-6">
              {breakdown && (
                <ReportReasonsBreakdown
                  breakdown={breakdown}
                  activeReasonFilter={reasonFilter}
                  onSelectReason={setReasonFilter}
                />
              )}
            </div>
          </div>

          {/* Action Confirmation Modal Dialog */}
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
        </>
      ) : activeTab === "showcases" ? (
        /* Showcase Approvals Tab — the publication gate for community
           showcases, which stay off the public index until approved here. */
        <ShowcaseReviewQueue />
      ) : (
        /* Moderation History Audit Log Tab */
        <ModerationHistoryTable />
      )}
    </motion.div>
  );
}
