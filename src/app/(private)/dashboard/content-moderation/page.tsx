"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ArrowLeft,
  History,
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
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
import { FlagDetailSheet } from "@/components/admin/FlagDetailSheet";
import type { ModerationActionType } from "@/lib/types/admin/types";

export default function ContentReportsPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);

  const { data, isLoading } = useGetContentReportsQuery();
  const [updateAction] = useUpdateContentReportActionMutation();

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

  const handleConfirmModalAction = (id: string, action: ModerationActionType, note?: string) => {
    updateAction({ id, action, resolutionNote: note });
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
              Content Reports & Moderation
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Content Reports & Moderation
            </h1>
            {breakdown && (
              <Badge className="bg-blue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-blue-600">
                {breakdown.total} pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review community-flagged submissions, manage user safety actions, and inspect historical audit logs.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === "queue"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="size-4 text-blue-600" />
            Reports Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === "history"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <History className="size-4 text-purple-600" />
            Moderation History Log
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
                    className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer transition shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
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
                  className="h-8 pl-8 pr-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>

              {/* Reason Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    />
                  }
                >
                  <SlidersHorizontal className="size-3.5 text-slate-400" />
                  <span>
                    Reason: {reasonFilter === "ALL" ? "All" : reasonFilter}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {reasonOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setReasonFilter(opt.value)}
                      className={reasonFilter === opt.value ? "font-bold text-blue-600" : ""}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    />
                  }
                >
                  <span className="text-slate-400 font-normal uppercase text-[10px] tracking-wider">
                    Sort:
                  </span>
                  <span>
                    {sortOptions.find((s) => s.value === sortBy)?.label || "Most Reported"}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={sortBy === opt.value ? "font-bold text-blue-600" : ""}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Filters Button */}
              {(typeFilter !== "ALL" || reasonFilter !== "ALL" || searchQuery.trim() !== "") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <RotateCcw className="size-3 mr-1" /> Reset
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
                      No Content Reports Match Filters
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
                        <ContentReportCard
                          report={report}
                          onAction={handleAction}
                          onViewDetail={(id) => setSelectedFlagId(id)}
                        />
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
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
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

          {/* Flag Detail Side Drawer */}
          <FlagDetailSheet
            flagId={selectedFlagId}
            isOpen={Boolean(selectedFlagId)}
            onClose={() => setSelectedFlagId(null)}
            onAction={handleAction}
          />
        </>
      ) : (
        /* Moderation History Audit Log Tab */
        <ModerationHistoryTable />
      )}
    </motion.div>
  );
}
