"use client";

import React from "react";
import { Flag, AlertTriangle, User, ShieldX, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

type ReportAction = "DISMISS" | "WARN" | "REMOVE";

interface ContentReportCardProps {
  report: ContentReportItem;
  onAction: (id: string, action: ReportAction) => void;
  onViewDetail?: (id: string) => void;
}

export function ContentReportCard({ report, onAction, onViewDetail }: ContentReportCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs hover:shadow-xs transition duration-200">
      <CardContent className="p-0 space-y-4">
        {/* Top Row: Type Badge + Title + Timestamp */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            <Badge
              variant="outline"
              className="rounded-lg border-slate-200 bg-slate-50 px-2.5 py-0.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {report.type}
            </Badge>
            <h3
              onClick={() => onViewDetail?.(report.id)}
              className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {report.title}
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium shrink-0 mt-0.5">
            {report.timestamp}
          </span>
        </div>

        {/* Optional Content Preview Snippet */}
        {report.snippet && (
          <p
            onClick={() => onViewDetail?.(report.id)}
            className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed font-normal cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition"
          >
            {report.snippet}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <Flag className="size-3.5 text-slate-500" />
            <span>{report.reportCount} reports</span>
          </div>

          <Badge
            variant="outline"
            className="rounded-lg border-slate-200 bg-white px-2.5 py-0.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {report.reason}
          </Badge>

          <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            <User className="size-3.5 text-slate-400" />
            <span>Author:</span>
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              @{report.author}
            </strong>
          </div>

          {report.pastViolationsCount && report.pastViolationsCount > 0 ? (
            <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 rounded-full px-2.5 py-0.5 font-bold flex items-center gap-1 text-xs">
              <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" />
              {report.pastViolationsCount} past violations
            </span>
          ) : null}
        </div>

        {/* Action Controls Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3.5 flex items-center justify-between text-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAction(report.id, "DISMISS")}
            className="h-9 cursor-pointer rounded-xl border-slate-200 px-3 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Check data-icon="inline-start" />
            Dismiss
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAction(report.id, "WARN")}
              className="h-9 cursor-pointer rounded-xl border-slate-300 px-3.5 font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <AlertTriangle data-icon="inline-start" className="text-amber-500" />
              Warn author
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onAction(report.id, "REMOVE")}
              className="h-9 cursor-pointer rounded-xl px-3.5 font-semibold shadow-2xs"
            >
              <ShieldX data-icon="inline-start" />
              Remove content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
