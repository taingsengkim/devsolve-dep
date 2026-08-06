"use client";

import { useMemo, useState } from "react";

import { MANAGED_REPORTS } from "@/components/report-management/mock-data";
import type {
  ManagedReport,
  ReportStatus,
  ReportSeverity,
  ReportType,
} from "@/components/report-management/types";

type TypeFilter = "All Types" | ReportType;
type SeverityFilter = "All" | ReportSeverity;
type StatusFilter = "All Statuses" | ReportStatus;

function paginateReports(
  reports: ManagedReport[],
  currentPage: number,
  rowsPerPage: number
) {
  const totalPages = Math.max(1, Math.ceil(reports.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;

  return {
    currentPage: safePage,
    totalPages,
    paginatedReports: reports.slice(startIndex, startIndex + rowsPerPage),
  };
}

export function useReportManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return MANAGED_REPORTS.filter((report) => {
      const matchesSearch =
        query.length === 0 ||
        report.title.toLowerCase().includes(query) ||
        report.author.toLowerCase().includes(query) ||
        report.assets.some((asset) => asset.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "All Types" || report.type === typeFilter;

      const matchesSeverity =
        severityFilter === "All" || report.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || report.status === statusFilter;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [searchTerm, severityFilter, statusFilter, typeFilter]);

  const typeCounts = useMemo(() => {
    return {
      bounty: MANAGED_REPORTS.filter((report) => report.type === "Bounty").length,
      response: MANAGED_REPORTS.filter((report) => report.type === "Response").length,
    };
  }, []);

  const severityCounts = useMemo(() => {
    return {
      critical: MANAGED_REPORTS.filter((report) => report.severity === "Critical").length,
      high: MANAGED_REPORTS.filter((report) => report.severity === "High").length,
      medium: MANAGED_REPORTS.filter((report) => report.severity === "Medium").length,
      low: MANAGED_REPORTS.filter((report) => report.severity === "Low").length,
    };
  }, []);

  const statusCounts = useMemo(() => {
    return {
      open: MANAGED_REPORTS.filter((report) => report.status === "Open").length,
      closed: MANAGED_REPORTS.filter((report) => report.status === "Closed").length,
    };
  }, []);

  const pagination = useMemo(() => {
    return paginateReports(filteredReports, currentPage, rowsPerPage);
  }, [filteredReports, currentPage, rowsPerPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
  }, [pagination.totalPages]);

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    rowsPerPage,
    setRowsPerPage,
    currentPage: pagination.currentPage,
    setCurrentPage,
    totalCount: MANAGED_REPORTS.length,
    filteredCount: filteredReports.length,
    paginatedReports: pagination.paginatedReports,
    totalPages: pagination.totalPages,
    pageNumbers,
    typeCounts,
    severityCounts,
    statusCounts,
  };
}
