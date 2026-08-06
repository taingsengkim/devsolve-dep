"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ProgramTypeFilter = "All" | "Bounty" | "Response";
export type AssetFilter = "All" | "Web" | "API" | "Mobile" | "Network";
export type StatusFilter = "All" | "Open" | "Done" | "Archived";

type PublicProgramFiltersProps = {
  totalCount: number;
  bountyCount: number;
  responseCount: number;
  privateCount: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  typeFilter: ProgramTypeFilter;
  onTypeFilterChange: (value: ProgramTypeFilter) => void;
  assetFilter: AssetFilter;
  onAssetFilterChange: (value: AssetFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
};

const TYPE_FILTERS: ProgramTypeFilter[] = ["All", "Bounty", "Response"];
const ASSET_FILTERS: AssetFilter[] = ["All", "Web", "API", "Mobile", "Network"];
const STATUS_FILTERS: StatusFilter[] = ["All", "Open", "Done", "Archived"];

export function PublicProgramFilters({
  totalCount,
  bountyCount,
  responseCount,
  privateCount,
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
  assetFilter,
  onAssetFilterChange,
  statusFilter,
  onStatusFilterChange,
  showMoreFilters,
  onToggleMoreFilters,
}: PublicProgramFiltersProps) {
  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Program Marketplace
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover bug bounty programs and responsible disclosure opportunities
              across web, mobile, API, and cloud platforms worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-600">
              {totalCount} All Programs
            </Badge>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-600">
              {bountyCount} Bounty
            </Badge>
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-600">
              {responseCount} Response
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-600">
              {privateCount} Private
            </Badge>
          </div>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search program , companies , keywords..."
            className="h-12 rounded-full border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 shadow-none focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((filter) => (
          <FilterPill
            key={filter}
            isActive={typeFilter === filter}
            onClick={() => onTypeFilterChange(filter)}
          >
            {filter}
          </FilterPill>
        ))}

        {ASSET_FILTERS.map((filter) => (
          <FilterPill
            key={filter}
            isActive={assetFilter === filter}
            onClick={() => onAssetFilterChange(filter)}
          >
            {filter}
          </FilterPill>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleMoreFilters}
          className="rounded-full border-slate-200 bg-white text-slate-600"
        >
          <SlidersHorizontal data-icon="inline-start" className="size-3.5" />
          More Filters
        </Button>
      </div>

      {showMoreFilters ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          {STATUS_FILTERS.map((filter) => (
            <FilterPill
              key={filter}
              isActive={statusFilter === filter}
              onClick={() => onStatusFilterChange(filter)}
            >
              Status: {filter}
            </FilterPill>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type FilterPillProps = {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

function FilterPill({ children, isActive, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        isActive
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}
