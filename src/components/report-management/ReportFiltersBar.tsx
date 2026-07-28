import { Search } from "lucide-react";

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
};

export function ReportFiltersBar({
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
  severityFilter,
  onSeverityFilterChange,
  typeCounts,
  severityCounts,
}: ReportFiltersBarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by title, author, or asset..."
            className="h-11 rounded-xl border-slate-300 bg-white pl-10 text-sm shadow-2xs focus-visible:border-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {[
              { label: "All", value: "All Types" as const },
              { label: `Bounty ${typeCounts.bounty}`, value: "Bounty" as const },
              { label: `Response ${typeCounts.response}`, value: "Response" as const },
            ].map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => onTypeFilterChange(filter.value)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  typeFilter === filter.value
                    ? "bg-blue-600 font-semibold text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs overflow-x-auto">
            {[
              { label: "All", value: "All" as const },
              { label: `Critical ${severityCounts.critical}`, value: "Critical" as const },
              { label: `High ${severityCounts.high}`, value: "High" as const },
              { label: `Medium ${severityCounts.medium}`, value: "Medium" as const },
              { label: `Low ${severityCounts.low}`, value: "Low" as const },
            ].map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => onSeverityFilterChange(filter.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  severityFilter === filter.value
                    ? "bg-slate-900 font-semibold text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
