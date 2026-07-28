import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
    <section className="flex flex-col gap-5 rounded-4xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-slate-900">Filter Reports</p>
          <p className="text-sm text-slate-500">
            Narrow the queue by report type, severity level, or keyword.
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by title, author, or asset..."
            className="border-slate-300 bg-white pl-10 text-base"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-slate-50/70 p-4 ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Report Type
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Types", value: "All Types" as const },
                { label: `Bounty (${typeCounts.bounty})`, value: "Bounty" as const },
                { label: `Response (${typeCounts.response})`, value: "Response" as const },
              ].map((filter) => (
                <Button
                  key={filter.label}
                  variant={typeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    typeFilter !== filter.value && "bg-white text-slate-600"
                  )}
                  onClick={() => onTypeFilterChange(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="hidden xl:block xl:h-14 xl:w-px xl:self-stretch xl:bg-slate-200" orientation="vertical" />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Severity
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={severityFilter === "All" ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full",
                  severityFilter !== "All" && "bg-white text-slate-600"
                )}
                onClick={() => onSeverityFilterChange("All")}
              >
                All
              </Button>
              {[
                { label: `Critical (${severityCounts.critical})`, value: "Critical" as const },
                { label: `High (${severityCounts.high})`, value: "High" as const },
                { label: `Medium (${severityCounts.medium})`, value: "Medium" as const },
                { label: `Low (${severityCounts.low})`, value: "Low" as const },
              ].map((filter) => (
                <Button
                  key={filter.label}
                  variant={severityFilter === filter.value ? "secondary" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    severityFilter !== filter.value && "bg-white text-slate-600"
                  )}
                  onClick={() => onSeverityFilterChange(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
