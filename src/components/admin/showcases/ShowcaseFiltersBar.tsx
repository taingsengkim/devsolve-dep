"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ShowcaseReviewStatus } from "@/lib/validations/showcase";

interface ShowcaseFiltersBarProps {
  statusFilter: ShowcaseReviewStatus | "ALL";
  onStatusChange: (status: ShowcaseReviewStatus | "ALL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export function ShowcaseFiltersBar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onReset,
}: ShowcaseFiltersBarProps) {
  const statusTabs: { label: string; value: ShowcaseReviewStatus | "ALL" }[] = [
    { label: "Pending Review", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "All Submissions", value: "ALL" },
  ];

  const hasActiveFilters = statusFilter !== "PENDING" || searchQuery.trim() !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input & Reset */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, category..."
            className="h-8 pl-8 pr-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shrink-0"
          >
            <RotateCcw className="size-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
