"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
import type { ReportReasonsBreakdownData } from "@/lib/redux/services/adminApi";

interface ReasonBar {
  label: string;
  key: keyof Omit<ReportReasonsBreakdownData, "total">;
  barColor: string;
  reasonValue: string;
}

const REASON_BARS: ReasonBar[] = [
  { label: "Spam", key: "spam", barColor: "bg-orange-500", reasonValue: "Spam" },
  { label: "Harmful", key: "harmful", barColor: "bg-rose-600", reasonValue: "Harmful" },
  { label: "Offensive", key: "offensive", barColor: "bg-amber-500", reasonValue: "Offensive" },
  { label: "Off-topic", key: "offTopic", barColor: "bg-slate-400 dark:bg-slate-500", reasonValue: "Off-topic" },
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
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5">
          <Filter className="size-3.5 text-slate-400" />
          Report Reasons Breakdown
        </h3>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {breakdown.total} pending
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {REASON_BARS.map(({ label, key, barColor, reasonValue }) => {
          const count = breakdown[key] || 0;
          const percentage = Math.round((count / total) * 100);
          const isSelected = activeReasonFilter.toLowerCase() === reasonValue.toLowerCase();

          return (
            <div
              key={key}
              onClick={() => onSelectReason?.(isSelected ? "ALL" : reasonValue)}
              className={`p-2.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                isSelected
                  ? "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 ring-2 ring-blue-500/20"
                  : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${barColor}`} />
                  {label}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {count} reports ({percentage}%)
                </span>
              </div>

              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-300`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
