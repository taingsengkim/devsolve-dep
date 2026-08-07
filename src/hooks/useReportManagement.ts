"use client";

import { useMemo, useState } from "react";

import type {
  ManagedReport,
  ReportStatus,
  ReportSeverity,
  ReportType,
} from "@/components/report-management/types";
import { useGetManagedReportsQuery } from "@/lib/redux/services/reportsApi";

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
  const {
    data: reports = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetManagedReportsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        query.length === 0 ||
        report.title.toLowerCase().includes(query) ||
        (report.reportId?.toLowerCase().includes(query) ?? false) ||
        report.author.toLowerCase().includes(query) ||
        report.authorEmail.toLowerCase().includes(query) ||
        report.assets.some((asset) => asset.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "All Types" || report.type === typeFilter;

      const matchesSeverity =
        severityFilter === "All" || report.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || report.status === statusFilter;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [reports, searchTerm, severityFilter, statusFilter, typeFilter]);

  const typeCounts = useMemo(() => {
    return {
      bounty: reports.filter((report) => report.type === "Bounty").length,
      response: reports.filter((report) => report.type === "Response").length,
    };
  }, [reports]);

  const severityCounts = useMemo(() => {
    return {
      critical: reports.filter((report) => report.severity === "Critical").length,
      high: reports.filter((report) => report.severity === "High").length,
      medium: reports.filter((report) => report.severity === "Medium").length,
      low: reports.filter((report) => report.severity === "Low").length,
    };
  }, [reports]);

  const statusCounts = useMemo(() => {
    return {
      open: reports.filter((report) => report.status === "Open").length,
      closed: reports.filter((report) => report.status === "Closed").length,
    };
  }, [reports]);

  const metrics = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((report) => report.queueState === "PENDING").length,
      underReview: reports.filter(
        (report) => report.queueState === "UNDER_REVIEW",
      ).length,
      approved: reports.filter((report) => report.queueState === "APPROVED").length,
    };
  }, [reports]);

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
    totalCount: reports.length,
    filteredCount: filteredReports.length,
    paginatedReports: pagination.paginatedReports,
    totalPages: pagination.totalPages,
    pageNumbers,
    typeCounts,
    severityCounts,
    statusCounts,
    metrics,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
