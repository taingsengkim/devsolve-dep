"use client";

import { motion } from "motion/react";

import { ManagedReportCard } from "@/components/report-management/ManagedReportCard";
import { ReportFiltersBar } from "@/components/report-management/ReportFiltersBar";
import { ReportManagementHeader } from "@/components/report-management/ReportManagementHeader";
import { ReportManagementPagination } from "@/components/report-management/ReportManagementPagination";
import { ReportMetricsGrid } from "@/components/report-management/ReportMetricsGrid";
import { useReportManagement } from "@/hooks/useReportManagement";

export default function ReportManagementPage() {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    severityFilter,
    setSeverityFilter,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    filteredCount,
    paginatedReports,
    totalPages,
    pageNumbers,
    typeCounts,
    severityCounts,
  } = useReportManagement();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <ReportManagementHeader />
      <ReportMetricsGrid />
      <ReportFiltersBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        typeCounts={typeCounts}
        severityCounts={severityCounts}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Active Report Queue
          </h2>
          <p className="mt-1 text-base text-slate-500">
            Showing {paginatedReports.length} of {filteredCount} matching reports.
          </p>
        </div>

        {paginatedReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="text-lg font-bold text-slate-800">No reports match the current filters</h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Try broadening the severity or type filters, or search with a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {paginatedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="h-full"
              >
                <ManagedReportCard report={report} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <ReportManagementPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
      />
    </motion.section>
  );
}
