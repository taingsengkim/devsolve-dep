"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Building2, ShieldCheck } from "lucide-react";
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
  const [submissionStateFilter, setSubmissionStateFilter] =
    useState<ProgramSubmissionState | "ALL">("ALL");
  const [stateFilter, setStateFilter] = useState<ProgramState | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  // Fetch program list from server API
  const { data: apiData, isLoading, isFetching } = useGetAdminProgramsQuery({
    submissionState:
      submissionStateFilter === "ALL" ? undefined : submissionStateFilter,
    state: stateFilter === "ALL" ? undefined : stateFilter,
    page,
    size: 20,
  });

  const programs: ProgramManagementSummaryItem[] = apiData?.content ?? [];
  const totalElements = apiData?.totalElements ?? programs.length;
  const totalPages = apiData?.totalPages ?? 1;

  // Filter client-side search query
  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return programs;
    return programs.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.handle?.toLowerCase().includes(q) ||
        p.organizationName?.toLowerCase().includes(q)
    );
  }, [programs, searchQuery]);

  // Counts summary
  const counts = useMemo(
    () => ({
      all: totalElements,
      pendingReview: programs.filter((p) => p.submissionState === "PENDING_REVIEW").length,
      approved: programs.filter((p) => p.submissionState === "APPROVED").length,
      rejected: programs.filter((p) => p.submissionState === "REJECTED").length,
    }),
    [programs, totalElements]
  );

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
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Admin Dashboard</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400">Program Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span>Program Management</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review, audit, approve, and oversee corporate security bug bounty programs.
          </p>
        </div>

        {/* Pending badge count alert */}
        {counts.pendingReview > 0 && (
          <div className="shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {counts.pendingReview} program{counts.pendingReview !== 1 ? "s" : ""} pending review
            </span>
          </div>
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

      {/* FILTER & SEARCH BAR */}
      <ProgramFiltersBar
        submissionStateFilter={submissionStateFilter}
        onSubmissionStateChange={(st) => {
          setSubmissionStateFilter(st);
          setPage(0);
        }}
        stateFilter={stateFilter}
        onStateChange={(st) => {
          setStateFilter(st);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={counts}
      />

      {/* DATA TABLE */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <ProgramDataTable
            columns={columns}
            data={filteredPrograms}
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </main>
    </motion.div>
  );
}
