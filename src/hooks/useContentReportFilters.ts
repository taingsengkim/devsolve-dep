import { useState, useMemo } from "react";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

export interface ContentReportFilters {
  typeFilter: string;
  reasonFilter: string;
  sortBy: "MOST_REPORTED" | "NEWEST" | "OLDEST";
  searchQuery: string;
  currentPage: number;
  rowsPerPage: number;
  setTypeFilter: (value: string) => void;
  setReasonFilter: (value: string) => void;
  setSortBy: (value: "MOST_REPORTED" | "NEWEST" | "OLDEST") => void;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  resetFilters: () => void;
  filteredReports: ContentReportItem[];
  paginatedReports: ContentReportItem[];
  totalFiltered: number;
  totalPages: number;
}

export function useContentReportFilters(
  reportsList: ContentReportItem[]
): ContentReportFilters {
  const [typeFilter, setTypeFilterState] = useState<string>("ALL");
  const [reasonFilter, setReasonFilterState] = useState<string>("ALL");
  const [sortBy, setSortByState] = useState<"MOST_REPORTED" | "NEWEST" | "OLDEST">("MOST_REPORTED");
  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPageState] = useState<number>(10);

  const setTypeFilter = (val: string) => {
    setTypeFilterState(val);
    setCurrentPage(1);
  };

  const setReasonFilter = (val: string) => {
    setReasonFilterState(val);
    setCurrentPage(1);
  };

  const setSortBy = (val: "MOST_REPORTED" | "NEWEST" | "OLDEST") => {
    setSortByState(val);
    setCurrentPage(1);
  };

  const setSearchQuery = (val: string) => {
    setSearchQueryState(val);
    setCurrentPage(1);
  };

  const setRowsPerPage = (rows: number) => {
    setRowsPerPageState(rows);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setTypeFilterState("ALL");
    setReasonFilterState("ALL");
    setSortByState("MOST_REPORTED");
    setSearchQueryState("");
    setCurrentPage(1);
  };

  const filteredReports = useMemo(() => {
    return reportsList
      .filter((item) => {
        if (item.status !== "PENDING") return false;
        if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
        if (reasonFilter !== "ALL" && item.reason.toLowerCase() !== reasonFilter.toLowerCase())
          return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchAuthor = item.author.toLowerCase().includes(q);
          const matchSnippet = item.snippet?.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchSnippet) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "MOST_REPORTED") {
          return b.reportCount - a.reportCount;
        }
        if (sortBy === "NEWEST") {
          return a.id > b.id ? -1 : 1;
        }
        if (sortBy === "OLDEST") {
          return a.id < b.id ? -1 : 1;
        }
        return 0;
      });
  }, [reportsList, typeFilter, reasonFilter, sortBy, searchQuery]);

  const totalFiltered = filteredReports.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredReports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredReports, currentPage, rowsPerPage]);

  return {
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
  };
}

