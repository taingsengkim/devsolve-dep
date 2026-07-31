"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { motion } from "motion/react";
import { Flag, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  useGetContentReportsQuery,
  useUpdateContentReportActionMutation,
} from "@/lib/redux/services/adminApi";
import { useContentReportFilters } from "@/hooks/useContentReportFilters";
import { ContentReportCard } from "@/components/admin/ContentReportCard";
import { ReportReasonsBreakdown } from "@/components/admin/ReportReasonsBreakdown";

export default function ContentReportsPage() {
  const { data, isLoading } = useGetContentReportsQuery();
  const [updateAction] = useUpdateContentReportActionMutation();

  const reportsList = data?.items ?? [];
  const breakdown = data?.breakdown;

  const { typeFilter, sortBy, setTypeFilter, filteredReports } =
    useContentReportFilters(reportsList);

  const handleAction = (id: string, action: "DISMISS" | "WARN" | "REMOVE") => {
    updateAction({ id, action });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Content Reports
            </h1>
            {breakdown && (
              <Badge className="bg-blue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-blue-600">
                {breakdown.total} pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review content flagged by the community and take action.
          </p>
        </div>
      </header>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer transition ${
              typeFilter === "ALL"
                ? "bg-blue-600 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All
          </button>

          <div className="relative">
            <button
              type="button"
              className="bg-white border border-slate-200 text-slate-800 font-semibold text-xs rounded-full px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 shadow-2xs"
            >
              <span>Content : All</span>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            SORT BY:
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3.5 rounded-xl border-slate-200 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>{sortBy}</span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Asymmetric 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Report Cards List */}
        <div className="lg:col-span-8 space-y-4">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-[20px]" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <Card className="rounded-[20px] border border-slate-200/80 bg-white p-12 text-center space-y-3 shadow-2xs">
              <div className="size-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Flag className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No Content Reports Pending
              </h3>
              <p className="text-sm text-slate-500">
                All flagged community posts and comments have been reviewed.
              </p>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <ContentReportCard
                key={report.id}
                report={report}
                onAction={handleAction}
              />
            ))
          )}
        </div>

        {/* Right Column: Report Reasons Breakdown Sidebar */}
        <div className="lg:col-span-4">
          {breakdown && <ReportReasonsBreakdown breakdown={breakdown} />}
        </div>
      </div>

      {/* Pagination Controls Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <div className="relative">
            <button
              type="button"
              className="bg-white border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-1 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              10
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-center">
          <button
            type="button"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-700 cursor-not-allowed font-medium"
            disabled
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>

          <button
            type="button"
            className="size-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-2xs"
          >
            1
          </button>
          <button
            type="button"
            className="size-7 rounded-full hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="size-7 rounded-full hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center cursor-pointer"
          >
            3
          </button>
          <span className="text-slate-400 px-1">...</span>

          <button
            type="button"
            className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
