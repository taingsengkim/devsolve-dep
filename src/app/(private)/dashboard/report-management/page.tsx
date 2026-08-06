"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { ManagedReportCard } from "@/components/report-management/ManagedReportCard";
import { ReportFiltersBar } from "@/components/report-management/ReportFiltersBar";
import { ReportManagementHeader } from "@/components/report-management/ReportManagementHeader";
import { ReportManagementPagination } from "@/components/report-management/ReportManagementPagination";
import { ReportMetricsGrid } from "@/components/report-management/ReportMetricsGrid";
import { reportListGridClass } from "@/components/report-management/report-list-layout";
import { Button } from "@/components/ui/button";
import {
  pageEnterContainer,
  pageEnterItem,
} from "@/components/ui/page-enter-motion";
import { useReportManagement } from "@/hooks/useReportManagement";

export default function ReportManagementPage() {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    rowsPerPage,
    currentPage,
    setCurrentPage,
    filteredCount,
    paginatedReports,
    totalPages,
    pageNumbers,
    typeCounts,
    severityCounts,
    statusCounts,
  } = useReportManagement();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    typeFilter !== "All Types" ||
    severityFilter !== "All" ||
    statusFilter !== "All Statuses";

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("All Types");
    setSeverityFilter("All");
    setStatusFilter("All Statuses");
    setCurrentPage(1);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageEnterContainer}
      className="mx-auto flex w-full  flex-col gap-5 pb-12"
    >
      <motion.div variants={pageEnterItem}>
        <ReportManagementHeader />
      </motion.div>

      <motion.div variants={pageEnterItem}>
        <ReportMetricsGrid />
      </motion.div>

      <motion.div variants={pageEnterItem} id="report-filters">
        <ReportFiltersBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeCounts={typeCounts}
          severityCounts={severityCounts}
          statusCounts={statusCounts}
          showMoreFilters={showMoreFilters}
          onToggleMoreFilters={() => setShowMoreFilters((current) => !current)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </motion.div>

      <motion.section variants={pageEnterItem} className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)] sm:px-6">
          <p className="text-sm font-medium text-[#0F172A]">
            Showing {filteredCount} reports
          </p>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={() => setCurrentPage(1)}
            className="rounded-xl border-slate-200 bg-white text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
            aria-label="Refresh report list"
          >
            <RefreshCw />
          </Button>
        </div>

        {paginatedReports.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <h3 className="text-xl font-semibold text-slate-900">
              No reports match the current filters
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing the search query or clear the selected filters to see more reports.
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="hidden border-b border-slate-200 px-6 py-4 lg:block">
              <div className={reportListGridClass}>
                {[
                  { label: "Report", align: "text-left" },
                  { label: "Assets", align: "text-left" },
                  { label: "Type", align: "text-center" },
                  { label: "Status", align: "text-center" },
                  { label: "Severity", align: "text-center" },
                ].map(({ label, align }) => (
                  <span
                    key={label}
                    className={`text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 ${align}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white">
              {paginatedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  <ManagedReportCard
                    report={report}
                    isLast={index === paginatedReports.length - 1}
                  />
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-200">
              <ReportManagementPagination
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                onPageChange={setCurrentPage}
                filteredCount={filteredCount}
              />
            </div>
          </div>
        )}
      </motion.section>
    </motion.section>
  );
}
