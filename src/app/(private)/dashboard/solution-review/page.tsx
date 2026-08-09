"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";
import {
  useGetAdminSolutionsQuery,
  useUpdateSolutionReviewStatusMutation,
  SolutionResponse,
  SolutionReviewStatus,
} from "@/lib/redux/services/admin/solutionAdminApi";
import { SolutionStatCards } from "@/components/admin/solutions/SolutionStatCards";
import { SolutionFiltersBar } from "@/components/admin/solutions/SolutionFiltersBar";
import { SolutionDataTable } from "@/components/admin/solutions/SolutionDataTable";
import { getSolutionColumns } from "@/components/admin/solutions/solutionColumns";
import { SolutionReviewModal } from "@/components/admin/solutions/SolutionReviewModal";

export default function SolutionReviewPage() {
  const [statusFilter, setStatusFilter] = useState<SolutionReviewStatus | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedSolution, setSelectedSolution] = useState<SolutionResponse | null>(null);

  const { data: apiData, isLoading, isFetching } = useGetAdminSolutionsQuery({
    reviewStatus: statusFilter === "ALL" ? undefined : statusFilter,
    pageNumber: page,
    pageSize: 20,
  });

  const [updateReviewStatus] = useUpdateSolutionReviewStatusMutation();

  const solutions: SolutionResponse[] = apiData?.content ?? [];
  const totalElements = apiData?.totalElements ?? solutions.length;
  const totalPages = apiData?.totalPages ?? 1;

  const filteredSolutions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return solutions;
    return solutions.filter(
      (s) =>
        s.id?.toLowerCase().includes(q) ||
        s.problemId?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [solutions, searchQuery]);

  const counts = useMemo(
    () => ({
      all: totalElements,
      pending: solutions.filter((s) => s.reviewStatus === "PENDING").length,
      approved: solutions.filter((s) => s.reviewStatus === "APPROVED" || s.reviewStatus === "ACCEPTED").length,
      rejected: solutions.filter((s) => s.reviewStatus === "REJECTED").length,
    }),
    [solutions, totalElements]
  );

  const handleUpdateReviewStatus = useCallback(
    async (id: string, reviewStatus: SolutionReviewStatus, rejectionReason?: string) => {
      await updateReviewStatus({ id, reviewStatus, rejectionReason }).unwrap();
    },
    [updateReviewStatus]
  );

  const columns = useMemo(
    () =>
      getSolutionColumns({
        onReview: (solution) => setSelectedSolution(solution),
      }),
    []
  );

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
            <span className="text-blue-600 dark:text-blue-400">Solution Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-blue-600" />
            <span>Solution Review Queue</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Audit, verify, approve, and review submitted technical problem solutions.
          </p>
        </div>

        {/* Pending badge count alert */}
        {counts.pending > 0 && (
          <div className="shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {counts.pending} solution{counts.pending !== 1 ? "s" : ""} pending review
            </span>
          </div>
        )}
      </header>

      {/* STAT CARDS */}
      {!isLoading && (
        <SolutionStatCards
          total={counts.all}
          pending={counts.pending}
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
      <SolutionFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setStatusFilter(st);
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
          <SolutionDataTable
            columns={columns}
            data={filteredSolutions}
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </main>

      {/* REVIEW MODAL */}
      <SolutionReviewModal
        selectedSolution={selectedSolution}
        onClose={() => setSelectedSolution(null)}
        onUpdateReviewStatus={handleUpdateReviewStatus}
      />
    </motion.div>
  );
}
