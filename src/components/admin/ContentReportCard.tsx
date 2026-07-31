"use client";

import React from "react";
import { Flag, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

type ReportAction = "DISMISS" | "WARN" | "REMOVE";

interface ContentReportCardProps {
  report: ContentReportItem;
  onAction: (id: string, action: ReportAction) => void;
}

export function ContentReportCard({ report, onAction }: ContentReportCardProps) {
  return (
    <Card className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-xs transition">
      <CardContent className="p-0 space-y-3.5">
        {/* Top Row: Type Badge + Title + Timestamp */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            <span className="text-xs font-extrabold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-0.5 rounded-md shrink-0">
              {report.type}
            </span>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-snug">
              {report.title}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-normal shrink-0 mt-0.5">
            {report.timestamp}
          </span>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Flag className="size-3.5 text-slate-500" />
            <span>{report.reportCount} reports</span>
          </div>

          <span className="bg-slate-50 border border-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
            {report.reason}
          </span>

          <span>
            Author:{" "}
            <strong className="text-slate-700 font-medium">{report.author}</strong>
          </span>

          {report.pastViolationsCount && (
            <span className="text-amber-800 bg-amber-50 border border-amber-200/80 rounded-full px-2.5 py-0.5 font-semibold flex items-center gap-1 text-xs">
              <AlertTriangle className="size-3 text-amber-600" />
              {report.pastViolationsCount} past violations
            </span>
          )}
        </div>

        {/* Action Row */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onAction(report.id, "DISMISS")}
            className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition"
          >
            Dismiss
          </button>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onAction(report.id, "WARN")}
              className="font-bold text-slate-800 hover:text-slate-950 cursor-pointer transition"
            >
              Warn author
            </button>
            <button
              type="button"
              onClick={() => onAction(report.id, "REMOVE")}
              className="font-bold text-rose-600 hover:text-rose-700 cursor-pointer transition"
            >
              Remove content
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
