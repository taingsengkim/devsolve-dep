"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type StatusFilterType = "ALL" | "PENDING" | "CONFIRMED" | "REJECTED" | "ESCALATED";
export type SeverityFilterType = "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface ReportConfirmationFiltersProps {
  statusFilter: StatusFilterType;
  onStatusFilterChange: (status: StatusFilterType) => void;
  severityFilter: SeverityFilterType;
  onSeverityFilterChange: (sev: SeverityFilterType) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    confirmed: number;
    rejected: number;
    escalated: number;
  };
}

export function ReportConfirmationFilters({
  statusFilter,
  onStatusFilterChange,
  severityFilter,
  onSeverityFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}: ReportConfirmationFiltersProps) {
  const statusTabs: { id: StatusFilterType; label: string; count: number }[] = [
    { id: "ALL", label: "All Queue", count: counts.all },
    { id: "PENDING", label: "Pending Triage", count: counts.pending },
    { id: "CONFIRMED", label: "Confirmed", count: counts.confirmed },
    { id: "REJECTED", label: "Rejected", count: counts.rejected },
    { id: "ESCALATED", label: "Escalated", count: counts.escalated },
  ];

  const severities: { id: SeverityFilterType; label: string }[] = [
    { id: "ALL", label: "All Severities" },
    { id: "CRITICAL", label: "Critical" },
    { id: "HIGH", label: "High" },
    { id: "MEDIUM", label: "Medium" },
    { id: "LOW", label: "Low" },
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
      {/* Search and Status Tabs Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search report, researcher, target..."
            className="pl-9 h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1">
          Severity:
        </span>
        {severities.map((sev) => {
          const isActive = severityFilter === sev.id;
          return (
            <Button
              key={sev.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onSeverityFilterChange(sev.id)}
              className={`rounded-xl text-xs font-semibold h-8 px-3 cursor-pointer ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {sev.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
