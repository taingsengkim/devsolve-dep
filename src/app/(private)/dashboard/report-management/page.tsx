"use client";

import { motion } from "motion/react";

import { ManagedReportCard } from "@/components/report-management/ManagedReportCard";
import { ReportFiltersBar } from "@/components/report-management/ReportFiltersBar";
import { ReportManagementHeader } from "@/components/report-management/ReportManagementHeader";
import { ReportManagementPagination } from "@/components/report-management/ReportManagementPagination";
import { ReportMetricsGrid } from "@/components/report-management/ReportMetricsGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="flex flex-col gap-6 pb-12"
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

      <Card className="border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Active Report Queue
              </CardTitle>
              <p className="text-base text-slate-500">
                Showing {paginatedReports.length} of {filteredCount} matching reports.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                Type: {typeFilter}
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                Severity: {severityFilter}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 bg-slate-50/10">
          {paginatedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No reports match the current filters
              </h3>
              <p className="max-w-md text-base text-slate-500">
                Try broadening the severity or type filters, or search with a different keyword.
              </p>
            </div>
          ) : (
            paginatedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <ManagedReportCard report={report} />
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

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
