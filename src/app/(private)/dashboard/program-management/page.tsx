"use client";

export const dynamic = "force-dynamic";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetAdminProgramsQuery,
  ProgramManagementSummaryItem,
  ProgramSubmissionState,
  ProgramState,
} from "@/lib/redux/services/admin/programAdminApi";
import { ProgramStatCards } from "@/components/admin/programs/ProgramStatCards";
import { ProgramFiltersBar } from "@/components/admin/programs/ProgramFiltersBar";
import { ProgramDataTable } from "@/components/admin/programs/ProgramDataTable";
import { getProgramColumns } from "@/components/admin/programs/programColumns";

export default function AdminProgramManagementPage() {
  const [submissionStateFilter, setSubmissionStateFilter] = useState<
    ProgramSubmissionState | "ALL"
  >("ALL");
  const [stateFilter, setStateFilter] = useState<ProgramState | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  /* Overall dataset for the stat cards and the tab counts. Without it the
     figures would only describe the page currently on screen, which changes
     every time a filter moves. */
  const { data: overallResponse } = useGetAdminProgramsQuery({ size: 100 });

  // Filtered dataset for the table itself.
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminProgramsQuery({
    submissionState:
      submissionStateFilter === "ALL" ? undefined : submissionStateFilter,
    state: stateFilter === "ALL" ? undefined : stateFilter,
    page: pageIndex,
    size: pageSize,
  });

  const programs: ProgramManagementSummaryItem[] = useMemo(
    () => response?.content ?? [],
    [response],
  );
  const totalElements = response?.totalElements ?? programs.length;
  const totalPages = response?.totalPages ?? 1;

  /* The admin endpoint takes no search parameter, so the query narrows the
     page already fetched rather than the whole set. */
  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return programs;
    return programs.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.handle?.toLowerCase().includes(q) ||
        p.organizationName?.toLowerCase().includes(q),
    );
  }, [programs, searchQuery]);

  const counts = useMemo(() => {
    const items = overallResponse?.content ?? programs;
    return {
      all: overallResponse?.totalElements ?? totalElements,
      pendingReview: items.filter((p) => p.submissionState === "PENDING_REVIEW")
        .length,
      approved: items.filter((p) => p.submissionState === "APPROVED").length,
      rejected: items.filter((p) => p.submissionState === "REJECTED").length,
    };
  }, [overallResponse, programs, totalElements]);

  const handleSubmissionStateChange = useCallback(
    (state: ProgramSubmissionState | "ALL") => {
      setSubmissionStateFilter(state);
      setPageIndex(0);
    },
    [],
  );

  const handleStateChange = useCallback((state: ProgramState | "ALL") => {
    setStateFilter(state);
    setPageIndex(0);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPageIndex(0);
  }, []);

  const columns = useMemo(() => getProgramColumns(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Program Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Program Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review, audit, approve, and oversee corporate security bug bounty
            programs.
          </p>
        </div>

        {/* Pending review alert badge */}
        {counts.pendingReview > 0 && (
          <Badge
            variant="outline"
            className="h-9 shrink-0 gap-2 rounded-xl border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <span className="size-2 rounded-full bg-amber-500" />
            <span>
              {counts.pendingReview} program
              {counts.pendingReview > 1 ? "s" : ""} pending review
            </span>
          </Badge>
        )}
      </header>

      {/* STAT CARDS */}
      {!isLoading && (
        <ProgramStatCards
          total={counts.all}
          pending={counts.pendingReview}
          approved={counts.approved}
          rejected={counts.rejected}
        />
      )}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      )}

      {/* FILTER BAR */}
      <ProgramFiltersBar
        submissionStateFilter={submissionStateFilter}
        onSubmissionStateChange={handleSubmissionStateChange}
        stateFilter={stateFilter}
        onStateChange={handleStateChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        counts={counts}
      />

      {/* DATA TABLE */}
      <main className="flex flex-col gap-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <ProgramDataTable
            columns={columns}
            data={filteredPrograms}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={totalPages}
            totalElements={totalElements}
            onPageChange={setPageIndex}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageIndex(0);
            }}
          />
        )}
      </main>
    </motion.div>
  );
}
