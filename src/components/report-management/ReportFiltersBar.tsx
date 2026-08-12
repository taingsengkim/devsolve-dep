"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReportFiltersBarProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  typeFilter: "All Types" | "Bounty" | "Response";
  onTypeFilterChange: (value: "All Types" | "Bounty" | "Response") => void;
  severityFilter: "All" | "Critical" | "High" | "Medium" | "Low";
  onSeverityFilterChange: (
    value: "All" | "Critical" | "High" | "Medium" | "Low"
  ) => void;
  statusFilter: "All Statuses" | "Open" | "Closed";
  onStatusFilterChange: (value: "All Statuses" | "Open" | "Closed") => void;
  typeCounts: {
    bounty: number;
    response: number;
  };
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  statusCounts: {
    open: number;
    closed: number;
  };
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

type ActiveFilterChip = {
  key: "type" | "severity" | "status";
  label: string;
  onRemove: () => void;
};

function countActiveFilters({
  typeFilter,
  severityFilter,
  statusFilter,
}: Pick<
  ReportFiltersBarProps,
  "typeFilter" | "severityFilter" | "statusFilter"
>) {
  return (
    Number(typeFilter !== "All Types") +
    Number(severityFilter !== "All") +
    Number(statusFilter !== "All Statuses")
  );
}

function normalizeFilterValue(value: string) {
  if (value === "All Types") return "All";
  if (value === "All Statuses") return "All";
  return value;
}

export function ReportFiltersBar({
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange,
  typeCounts,
  severityCounts,
  statusCounts,
  showMoreFilters,
  onToggleMoreFilters,
  hasActiveFilters,
  onClearFilters,
}: ReportFiltersBarProps) {
  const activeFiltersCount = countActiveFilters({
    typeFilter,
    severityFilter,
    statusFilter,
  });

  const activeChips: ActiveFilterChip[] = [
    ...(typeFilter !== "All Types"
      ? [
          {
            key: "type" as const,
            label: typeFilter,
            onRemove: () => onTypeFilterChange("All Types"),
          },
        ]
      : []),
    ...(statusFilter !== "All Statuses"
      ? [
          {
            key: "status" as const,
            label: statusFilter,
            onRemove: () => onStatusFilterChange("All Statuses"),
          },
        ]
      : []),
    ...(severityFilter !== "All"
      ? [
          {
            key: "severity" as const,
            label: severityFilter,
            onRemove: () => onSeverityFilterChange("All"),
          },
        ]
      : []),
  ];

  return (
    <section className="rounded-[20px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search by title, submitter, report ID, or asset..."
              className="h-11 rounded-xl border border-border bg-card pl-11 pr-12 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 inline-flex h-7 min-w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-muted px-2 text-[11px] font-semibold text-muted-foreground">
              /
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
            <FilterDropdown
              label="Type"
              value={typeFilter}
              displayValue={normalizeFilterValue(typeFilter)}
              options={[
                { label: `All Types (${typeCounts.bounty + typeCounts.response})`, value: "All Types" },
                { label: `Bounty (${typeCounts.bounty})`, value: "Bounty" },
                { label: `Response (${typeCounts.response})`, value: "Response" },
              ]}
              onChange={(value) =>
                onTypeFilterChange(value as "All Types" | "Bounty" | "Response")
              }
              minWidthClassName="min-w-[148px]"
            />

            <FilterDropdown
              label="Severity"
              value={severityFilter}
              displayValue={normalizeFilterValue(severityFilter)}
              options={[
                { label: "All severity", value: "All" },
                { label: `Critical (${severityCounts.critical})`, value: "Critical" },
                { label: `High (${severityCounts.high})`, value: "High" },
                { label: `Medium (${severityCounts.medium})`, value: "Medium" },
                { label: `Low (${severityCounts.low})`, value: "Low" },
              ]}
              onChange={(value) =>
                onSeverityFilterChange(
                  value as "All" | "Critical" | "High" | "Medium" | "Low"
                )
              }
              minWidthClassName="min-w-[152px]"
            />

            <FilterDropdown
              label="Status"
              value={statusFilter}
              displayValue={normalizeFilterValue(statusFilter)}
              options={[
                { label: "All status", value: "All Statuses" },
                { label: `Open (${statusCounts.open})`, value: "Open" },
                { label: `Closed (${statusCounts.closed})`, value: "Closed" },
              ]}
              onChange={(value) =>
                onStatusFilterChange(value as "All Statuses" | "Open" | "Closed")
              }
              minWidthClassName="min-w-[144px]"
            />

            <div className="hidden h-8 w-px bg-border xl:block" />

            <Button
              type="button"
              variant="outline"
              onClick={onToggleMoreFilters}
              aria-pressed={showMoreFilters}
              className={cn(
                "h-11 rounded-xl border-border bg-card px-4 text-sm font-medium text-foreground shadow-none hover:bg-muted cursor-pointer",
                showMoreFilters && "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              )}
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filters
              {activeFiltersCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {activeFiltersCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showMoreFilters ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 border-t border-border"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Active Filter Summary
                </span>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear all filters
                  </Button>
                ) : null}
              </div>

              {activeChips.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <span
                      key={chip.key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {chip.label}
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="rounded-full p-0.5 hover:bg-foreground/10 cursor-pointer"
                        aria-label={`Remove ${chip.label} filter`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FilterDropdown({
  label,
  value,
  displayValue,
  options,
  onChange,
  minWidthClassName,
}: {
  label: string;
  value: string;
  displayValue: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  minWidthClassName?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-left text-sm text-foreground shadow-none outline-none transition-colors hover:bg-muted focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 cursor-pointer",
          minWidthClassName
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="text-muted-foreground">{label}:</span>
          <span className="truncate font-medium text-foreground">{displayValue}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="rounded-2xl border border-border bg-card text-card-foreground p-1.5 shadow-md"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="rounded-xl px-3 py-2.5 text-foreground data-[checked]:bg-blue-500/10 data-[checked]:text-blue-600 dark:data-[checked]:text-blue-400 focus:bg-muted"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
