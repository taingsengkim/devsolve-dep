"use client";

import React from "react";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProgramSubmissionState,
  ProgramState,
} from "@/lib/types/admin/programAdminTypes";

/**
 * Filters for program management, in the same shape as the users dashboard's
 * bar: a segmented review-state group carrying its counts, then the inputs.
 *
 * Programs have one control users do not — lifecycle state is independent of
 * review state, so a paused program can still be approved — and it sits with
 * the search box rather than in the segmented group, which is reserved for the
 * decision this screen is about.
 */

interface ProgramFiltersBarProps {
  submissionStateFilter: ProgramSubmissionState | "ALL";
  onSubmissionStateChange: (state: ProgramSubmissionState | "ALL") => void;
  stateFilter: ProgramState | "ALL";
  onStateChange: (state: ProgramState | "ALL") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pendingReview: number;
    approved: number;
    rejected: number;
  };
}

const REVIEW_TABS: {
  key: ProgramSubmissionState | "ALL";
  label: string;
  countKey: keyof ProgramFiltersBarProps["counts"];
}[] = [
  { key: "ALL", label: "All Programs", countKey: "all" },
  { key: "PENDING_REVIEW", label: "Pending Review", countKey: "pendingReview" },
  { key: "APPROVED", label: "Approved", countKey: "approved" },
  { key: "REJECTED", label: "Rejected", countKey: "rejected" },
];

const LIFECYCLE_STATES: { value: ProgramState | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Lifecycle States" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "CLOSED", label: "Closed" },
];

export const ProgramFiltersBar: React.FC<ProgramFiltersBarProps> = ({
  submissionStateFilter,
  onSubmissionStateChange,
  stateFilter,
  onStateChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}) => {
  /* The two halves go side by side only from `xl`. This bar carries one
     control more than the users bar does, and below that width the dashboard
     sidebar leaves too little room for the tabs and both inputs on one line.
     Both halves can also shrink: `ToggleGroup` ships with `w-fit`, so without
     `min-w-0` it refuses to give and pushes the inputs out of the card. */
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs xl:flex-row xl:items-center dark:border-slate-800 dark:bg-slate-900">
      {/* REVIEW STATE TABS */}
      <ToggleGroup
        multiple={false}
        value={[submissionStateFilter]}
        onValueChange={(values) => {
          const next = values[values.length - 1] as ProgramSubmissionState | "ALL" | undefined;
          if (next) {
            onSubmissionStateChange(next);
          }
        }}
        spacing={1}
        className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80"
      >
        {REVIEW_TABS.map((tab) => {
          const isActive = submissionStateFilter === tab.key;
          return (
            <ToggleGroupItem
              key={tab.key}
              value={tab.key}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-sm font-semibold text-slate-600 data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-2xs dark:text-slate-400 dark:data-[state=on]:bg-slate-900 dark:data-[state=on]:text-slate-100"
            >
              <span>{tab.label}</span>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="rounded-full tabular-nums"
              >
                {counts[tab.countKey] ?? 0}
              </Badge>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
        {/* LIFECYCLE STATE */}
        <div className="w-full sm:w-44 sm:shrink-0">
          <Select
            value={stateFilter}
            onValueChange={(val) => {
              if (val) onStateChange(val as ProgramState | "ALL");
            }}
          >
            <SelectTrigger
              aria-label="Filter by lifecycle state"
              className="h-10 cursor-pointer rounded-xl border-slate-300 bg-white text-sm font-medium shadow-2xs dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-center gap-2">
                <Filter className="size-3.5 text-slate-400" />
                <SelectValue placeholder="All Lifecycle States" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
              {LIFECYCLE_STATES.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SEARCH — the half that gives when the row runs out of room. */}
        <div className="relative w-full min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search program, handle, or organization..."
            className="h-10 rounded-xl border-slate-300 bg-white pl-9 pr-10 text-sm shadow-2xs dark:border-slate-700 dark:bg-slate-950"
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Clear program search"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
