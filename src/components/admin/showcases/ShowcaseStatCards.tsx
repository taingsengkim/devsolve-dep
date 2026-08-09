"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { ShowcaseReviewQueueItem } from "@/lib/redux/services/admin/showcaseReviewApi";

interface ShowcaseStatCardsProps {
  items: ShowcaseReviewQueueItem[];
  isLoading?: boolean;
}

export function ShowcaseStatCards({ items, isLoading }: ShowcaseStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>
    );
  }

  const total = items.length;
  const pending = items.filter((item) => item.reviewStatus === "PENDING").length;
  const approved = items.filter((item) => item.reviewStatus === "APPROVED").length;
  const rejected = items.filter((item) => item.reviewStatus === "REJECTED").length;

  const stats = [
    {
      title: "Total Submissions",
      value: total,
      icon: Sparkles,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
      borderColor: "border-blue-200/60 dark:border-blue-900/50",
    },
    {
      title: "Pending Review",
      value: pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
      borderColor: "border-amber-200/60 dark:border-amber-900/50",
    },
    {
      title: "Approved Showcases",
      value: approved,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
      borderColor: "border-emerald-200/60 dark:border-emerald-900/50",
    },
    {
      title: "Rejected Submissions",
      value: rejected,
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400",
      borderColor: "border-rose-200/60 dark:border-rose-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 ${stat.borderColor} shadow-2xs flex items-center justify-between transition-all hover:shadow-xs`}
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
              <Icon className="size-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
