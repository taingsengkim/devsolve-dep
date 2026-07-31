"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrganizationFiltersBarProps {
  statusFilter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  onStatusFilterChange: (status: "ALL" | "PENDING" | "APPROVED" | "REJECTED") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const OrganizationFiltersBar: React.FC<OrganizationFiltersBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
      {/* STATUS FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
        {[
          { key: "ALL", label: "All Organizations", count: counts.all },
          { key: "PENDING", label: "Pending KYC", count: counts.pending },
          { key: "APPROVED", label: "Approved", count: counts.approved },
          { key: "REJECTED", label: "Rejected", count: counts.rejected },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? "default" : "ghost"}
            onClick={() => onStatusFilterChange(tab.key as any)}
            className={`rounded-xl text-xs font-semibold h-9 px-3.5 cursor-pointer transition-all ${
              statusFilter === tab.key
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                statusFilter === tab.key
                  ? "bg-blue-500/40 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </Button>
        ))}
      </div>

      {/* SEARCH INPUT BAR */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by company, domain, or Tax ID..."
          className="pl-9 pr-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm focus-visible:ring-blue-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
