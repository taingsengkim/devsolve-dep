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
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Type</span>
          {[
            { label: `All Types ${typeCounts.bounty + typeCounts.response}`, value: "All Types" as const },
            { label: `Bounty ${typeCounts.bounty}`, value: "Bounty" as const },
            { label: `Response ${typeCounts.response}`, value: "Response" as const },
          ].map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => onTypeFilterChange(filter.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                typeFilter === filter.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Severity</span>
          {[
            { label: `Critical ${severityCounts.critical}`, value: "Critical" as const },
            { label: `High ${severityCounts.high}`, value: "High" as const },
            { label: `Medium ${severityCounts.medium}`, value: "Medium" as const },
            { label: `Low ${severityCounts.low}`, value: "Low" as const },
            { label: "All", value: "All" as const },
          ].map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => onSeverityFilterChange(filter.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                severityFilter === filter.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search Report..."
          className="h-10 rounded-full border-slate-200 bg-slate-50 pl-10 text-sm shadow-none focus-visible:border-blue-500 focus-visible:ring-blue-400/20"
        />
      </div>
    </section>
  );
}
