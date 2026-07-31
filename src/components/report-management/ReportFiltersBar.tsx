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
    <section className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)] sm:px-5 sm:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search by title, submitter, report ID, or asset..."
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-700 shadow-none placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 inline-flex h-7 min-w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-400">
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

            <div className="hidden h-8 w-px bg-slate-200 xl:block" />

            <Button
              type="button"
              variant="outline"
              onClick={onToggleMoreFilters}
              aria-pressed={showMoreFilters}
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-none hover:border-blue-200 hover:bg-blue-50/60 hover:text-[#2563EB]",
                showMoreFilters && "border-blue-200 bg-blue-50 text-[#2563EB]"
              )}
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filters
              {activeFiltersCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {activeFiltersCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 text-sm font-medium text-[#2563EB] transition-colors hover:border-blue-200 hover:bg-blue-100"
              >
                <span>{chip.label}</span>
                <X className="size-3.5" />
              </button>
            ))}

            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-8 items-center gap-2 rounded-full px-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
            >
              <X className="size-3.5" />
              Clear all
            </button>
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {showMoreFilters ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-3"
            >
              {[
                {
                  title: "Type",
                  value: typeFilter === "All Types" ? "All" : typeFilter,
                },
                {
                  title: "Severity",
                  value: severityFilter === "All" ? "All" : severityFilter,
                },
                {
                  title: "Status",
                  value: statusFilter === "All Statuses" ? "All" : statusFilter,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.title}
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-slate-700">
                    {item.value}
                  </div>
                </div>
              ))}
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
          "inline-flex h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-700 shadow-none outline-none transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10",
          minWidthClassName
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="text-slate-400">{label}:</span>
          <span className="truncate font-medium text-slate-700">{displayValue}</span>
        </span>
        <ChevronDown className="size-4 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="rounded-xl px-3 py-2.5 text-slate-700 data-[checked]:bg-blue-50 data-[checked]:text-[#2563EB] focus:bg-blue-50 focus:text-[#2563EB]"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
