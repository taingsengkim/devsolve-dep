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
    <Card className="gap-5 rounded-2xl border border-border bg-card text-card-foreground py-6 shadow-xs">
      <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-6">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Filter className="size-4 text-muted-foreground" />
          Report reasons
        </CardTitle>
        <Badge variant="secondary" className="rounded-full tabular-nums bg-muted text-muted-foreground border-border">
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
                  ? "border-blue-500/50 bg-blue-500/10 text-foreground"
                  : "border-transparent bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                <span>{label}</span>
                <span className="font-normal text-muted-foreground">
                  {count} reports ({percentage}%)
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
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
