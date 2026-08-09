"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import type { ReportReasonsBreakdownData } from "@/lib/redux/services/adminApi";
import { cn } from "@/lib/utils";

interface ReasonBar {
  label: string;
  key: keyof Omit<ReportReasonsBreakdownData, "total">;
  reasonValue: string;
}

const REASON_BARS: ReasonBar[] = [
  { label: "Spam", key: "spam", reasonValue: "Spam" },
  { label: "Harmful", key: "harmful", reasonValue: "Harmful" },
  { label: "Offensive", key: "offensive", reasonValue: "Offensive" },
  { label: "Off-topic", key: "offTopic", reasonValue: "Off-topic" },
];

interface ReportReasonsBreakdownProps {
  breakdown: ReportReasonsBreakdownData;
  activeReasonFilter?: string;
  onSelectReason?: (reason: string) => void;
}

export function ReportReasonsBreakdown({
  breakdown,
  activeReasonFilter = "ALL",
  onSelectReason,
}: ReportReasonsBreakdownProps) {
  const total = breakdown.total || 1;

  return (
    <Card className="gap-5 rounded-2xl border border-slate-200/80 bg-white py-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-6">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          <Filter className="size-4 text-slate-400" />
          Report reasons
        </CardTitle>
        <Badge variant="secondary" className="rounded-full tabular-nums">
          {breakdown.total} pending
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-6">
        {REASON_BARS.map(({ label, key, reasonValue }) => {
          const count = breakdown[key] || 0;
          const percentage = Math.round((count / total) * 100);
          const isSelected = activeReasonFilter.toLowerCase() === reasonValue.toLowerCase();

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectReason?.(isSelected ? "ALL" : reasonValue)}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
                isSelected
                  ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                  : "border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40",
              )}
            >
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>{label}</span>
                <span className="font-normal text-slate-500 dark:text-slate-400">
                  {count} reports ({percentage}%)
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-slate-700 dark:bg-slate-300"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
