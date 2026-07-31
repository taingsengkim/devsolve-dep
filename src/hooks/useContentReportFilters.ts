import { useState } from "react";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

export interface ContentReportFilters {
  typeFilter: string;
  reasonFilter: string;
  sortBy: string;
  setTypeFilter: (value: string) => void;
  setReasonFilter: (value: string) => void;
  setSortBy: (value: string) => void;
  filteredReports: ContentReportItem[];
}

export function useContentReportFilters(
  reportsList: ContentReportItem[]
): ContentReportFilters {
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [reasonFilter, setReasonFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("Most reported");

  const filteredReports = reportsList.filter((item) => {
    if (item.status !== "PENDING") return false;
    if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
    if (reasonFilter !== "ALL" && item.reason !== reasonFilter) return false;
    return true;
  });

  return {
    typeFilter,
    reasonFilter,
    sortBy,
    setTypeFilter,
    setReasonFilter,
    setSortBy,
    filteredReports,
  };
}
