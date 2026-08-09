"use client";

import React from "react";
import { Flag, AlertTriangle, User, ShieldX, Check, Eye } from "lucide-react";
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

export function ContentReportCard({
  report,
  onAction,
  onViewDetail,
}: ContentReportCardProps) {
  const getTypeColor = (type: ContentReportItem["type"]) => {
    switch (type) {
      case "SOLUTION":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      case "PROBLEM":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      case "COMMENT":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "PROGRAM":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getReasonBadge = (reason: ContentReportItem["reason"]) => {
    switch (reason) {
      case "Spam":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50";
      case "Harmful":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50";
      case "Offensive":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50";
      case "Off-topic":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs hover:shadow-xs transition duration-200">
      <CardContent className="p-0 space-y-4">
        {/* Top Row: Type Badge + Title + Timestamp */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            <Badge
              variant="outline"
              className={`rounded-md px-2.5 py-0.5 text-xs font-extrabold tracking-wider uppercase ${getTypeColor(
                report.type
              )}`}
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
            <Flag className="size-3.5 text-rose-500" />
            <span>{report.reportCount} reports</span>
          </div>

          <Badge
            variant="outline"
            className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${getReasonBadge(
              report.reason
            )}`}
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
          <div className="flex items-center gap-2">
            {onViewDetail && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewDetail(report.id)}
                className="h-8 px-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
              >
                <Eye className="size-3.5 mr-1 text-blue-500" />
                View Detail
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onAction(report.id, "DISMISS")}
              className="h-8 px-3 rounded-lg font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition"
            >
              <Check className="size-3.5 mr-1" />
              Dismiss
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAction(report.id, "WARN")}
              className="h-8 px-3.5 rounded-xl font-semibold border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition text-xs"
            >
              <AlertTriangle className="size-3.5 mr-1 text-amber-500" />
              Warn author
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onAction(report.id, "REMOVE")}
              className="h-8 px-3.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition text-xs shadow-2xs"
            >
              <ShieldX className="size-3.5 mr-1" />
              Remove content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
