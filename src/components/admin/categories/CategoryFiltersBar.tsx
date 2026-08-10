"use client";

import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
import { CATEGORY_SCOPES } from "@/lib/validations/category";

export type CategoryScopeFilter = "ALL" | (typeof CATEGORY_SCOPES)[number];
export type CategoryStateFilter = "ALL" | "ACTIVE" | "INACTIVE";

interface CategoryCounts {
  all: number;
  active: number;
  inactive: number;
}

interface CategoryFiltersBarProps {
  stateFilter: CategoryStateFilter;
  onStateFilterChange: (state: CategoryStateFilter) => void;
  scopeFilter: CategoryScopeFilter;
  onScopeFilterChange: (scope: CategoryScopeFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: CategoryCounts;
}

const STATE_TABS: {
  key: CategoryStateFilter;
  label: string;
  countKey: keyof CategoryCounts;
}[] = [
  { key: "ALL", label: "All", countKey: "all" },
  { key: "ACTIVE", label: "Active", countKey: "active" },
  { key: "INACTIVE", label: "Inactive", countKey: "inactive" },
];

export function CategoryFiltersBar({
  stateFilter,
  onStateFilterChange,
  scopeFilter,
  onScopeFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}: CategoryFiltersBarProps) {
  /* Same layout contract as the program bar: both halves carry `min-w-0` so
     neither can push the other out of the card, and the search is the element
     that gives when the row runs short. */
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs xl:flex-row xl:items-center dark:border-slate-800 dark:bg-slate-900">
      {/* STATE TABS */}
      <ToggleGroup
        multiple={false}
        value={[stateFilter]}
        onValueChange={(values) => {
          const next = values[values.length - 1] as
            | CategoryStateFilter
            | undefined;
          if (next) onStateFilterChange(next);
        }}
        spacing={1}
        className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80"
      >
        {STATE_TABS.map((tab) => {
          const isActive = stateFilter === tab.key;
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
        {/* SCOPE */}
        <div className="w-full sm:w-44 sm:shrink-0">
          <Select
            value={scopeFilter}
            onValueChange={(value) => {
              if (value) onScopeFilterChange(value as CategoryScopeFilter);
            }}
          >
            <SelectTrigger
              aria-label="Filter by scope"
              className="h-10 cursor-pointer rounded-xl border-slate-300 bg-white text-sm font-medium shadow-2xs dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-slate-400" />
                <SelectValue placeholder="All scopes" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
              <SelectItem value="ALL" className="cursor-pointer rounded-lg text-sm">
                All scopes
              </SelectItem>
              {CATEGORY_SCOPES.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer rounded-lg text-sm capitalize"
                >
                  {option.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SEARCH */}
        <div className="relative w-full min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search name or slug..."
            className="h-10 rounded-xl border-slate-300 bg-white pl-9 pr-10 text-sm shadow-2xs dark:border-slate-700 dark:bg-slate-950"
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Clear category search"
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
}
