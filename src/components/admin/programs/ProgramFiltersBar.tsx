import React from "react";
import { ArrowUpDown, Filter, Search, X } from "lucide-react";
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

interface ProgramFiltersBarProps {
  submissionStateFilter: ProgramSubmissionState | "ALL";
  onSubmissionStateChange: (state: ProgramSubmissionState | "ALL") => void;
  stateFilter: ProgramState | "ALL";
  onStateChange: (state: ProgramState | "ALL") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sort?: string;
  onSortChange?: (sort: string) => void;
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

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "updatedAt,DESC", label: "Recently Updated" },
  { value: "createdAt,DESC", label: "Newest Created" },
  { value: "createdAt,ASC", label: "Oldest Created" },
  { value: "name,ASC", label: "Name: A-Z" },
];

export const ProgramFiltersBar: React.FC<ProgramFiltersBarProps> = ({
  submissionStateFilter,
  onSubmissionStateChange,
  stateFilter,
  onStateChange,
  searchQuery,
  onSearchQueryChange,
  sort = "updatedAt,DESC",
  onSortChange,
  counts,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs xl:flex-row xl:items-center dark:border-slate-800 dark:bg-slate-900/90">
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
        className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/80"
      >
        {REVIEW_TABS.map((tab) => {
          const isActive = submissionStateFilter === tab.key;
          return (
            <ToggleGroupItem
              key={tab.key}
              value={tab.key}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-sm font-semibold text-slate-600 data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-2xs dark:text-slate-400 dark:hover:text-slate-200 dark:data-[state=on]:bg-slate-800 dark:data-[state=on]:text-slate-100"
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
              className="h-10 cursor-pointer rounded-xl border-slate-300 bg-white text-sm font-medium shadow-2xs transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <Filter className="size-3.5 text-slate-400" />
                <SelectValue placeholder="All Lifecycle States" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              {LIFECYCLE_STATES.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg text-sm dark:focus:bg-slate-800 dark:focus:text-slate-100"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SORT ORDER */}
        <div className="w-full sm:w-44 sm:shrink-0">
          <Select
            value={sort}
            onValueChange={(val) => {
              if (val && onSortChange) onSortChange(val);
            }}
          >
            <SelectTrigger
              aria-label="Sort order"
              className="h-10 cursor-pointer rounded-xl border-slate-300 bg-white text-sm font-medium shadow-2xs transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center gap-2 truncate">
                <ArrowUpDown className="size-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Sort order" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg text-sm dark:focus:bg-slate-800 dark:focus:text-slate-100"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SEARCH */}
        <div className="relative w-full min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search program, handle, or organization..."
            className="h-10 rounded-xl border-slate-300 bg-white pl-9 pr-10 text-sm shadow-2xs transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:text-slate-100"
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Clear program search"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
