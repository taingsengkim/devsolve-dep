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
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs xl:flex-row xl:items-center">
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
        className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-border bg-muted p-1"
      >
        {STATE_TABS.map((tab) => {
          const isActive = stateFilter === tab.key;
          return (
            <ToggleGroupItem
              key={tab.key}
              value={tab.key}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-sm font-semibold text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-2xs"
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
              className="h-10 cursor-pointer rounded-xl border-border bg-card text-sm font-medium text-foreground shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="All scopes" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search name or slug..."
            className="h-10 rounded-xl border-border bg-card pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-2xs"
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Clear category search"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
