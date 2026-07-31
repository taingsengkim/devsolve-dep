"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { ReportReasonsBreakdownData } from "@/lib/redux/services/adminApi";

interface ReasonBar {
  label: string;
  key: keyof Omit<ReportReasonsBreakdownData, "total">;
  barColor: string;
}

const REASON_BARS: ReasonBar[] = [
  { label: "Spam", key: "spam", barColor: "bg-orange-500" },
  { label: "Harmful", key: "harmful", barColor: "bg-rose-600" },
  { label: "Offensive", key: "offensive", barColor: "bg-amber-500" },
  { label: "Off-topic", key: "offTopic", barColor: "bg-slate-400" },
];

interface ReportReasonsBreakdownProps {
  breakdown: ReportReasonsBreakdownData;
}

export function ReportReasonsBreakdown({ breakdown }: ReportReasonsBreakdownProps) {
  return (
    <Card className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
      <h3 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
        Report Reasons Breakdown
      </h3>

      <div className="space-y-4 text-xs">
        {REASON_BARS.map(({ label, key, barColor }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{label}</span>
              <span className="text-slate-500 font-normal">
                {breakdown[key]} reports
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full`}
                style={{
                  width: `${(breakdown[key] / breakdown.total) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
