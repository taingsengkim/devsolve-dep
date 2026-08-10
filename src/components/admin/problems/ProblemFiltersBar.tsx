"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProblemStatus } from "@/lib/types/admin/problemAdminTypes";

interface ProblemFiltersBarProps {
  statusFilter: ProblemStatus | "ALL";
  onStatusFilterChange: (status: ProblemStatus | "ALL") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pendingApproval: number;
    published: number;
    rejected: number;
  };
}

const TABS: {
  key: ProblemStatus | "ALL";
  label: string;
  countKey: keyof ProblemFiltersBarProps["counts"];
}[] = [
  { key: "ALL", label: "All", countKey: "all" },
  { key: "PENDING_APPROVAL", label: "Pending Approval", countKey: "pendingApproval" },
  { key: "PUBLISHED", label: "Published", countKey: "published" },
  { key: "REJECTED", label: "Rejected", countKey: "rejected" },
];

export const ProblemFiltersBar: React.FC<ProblemFiltersBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
      {/* STATUS FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <Button
              key={tab.key}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onStatusFilterChange(tab.key)}
              className={`rounded-xl text-sm font-semibold h-9 px-3.5 cursor-pointer transition-all shrink-0 ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-blue-500/40 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {counts[tab.countKey]}
              </span>
            </Button>
          );
        })}
      </div>

      {/* SEARCH INPUT BAR */}
      <div className="relative w-full sm:w-80 shrink-0">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search problem title or author..."
          className="pl-9 pr-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm focus-visible:ring-blue-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
