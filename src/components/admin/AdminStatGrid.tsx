"use client";

import React from "react";
import {
  Building2,
  Globe,
  FileText,
  Users,
  MessageSquare,
  Swords,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AdminStatMetric } from "@/lib/types/admin/types";

/** Lookup map from stat type → icon — avoids chained conditionals */
const STAT_ICONS: Record<AdminStatMetric["type"], LucideIcon> = {
  organizations: Building2,
  programs: Globe,
  total_reports: FileText,
  users: Users,
  community_posts: MessageSquare,
  disputes: Swords,
};

interface AdminStatGridProps {
  stats: AdminStatMetric[];
}

export function AdminStatGrid({ stats }: AdminStatGridProps) {
  return (
    <Card className="rounded-[20px] border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {stats.map((stat, idx) => {
          const Icon = STAT_ICONS[stat.type];
          return (
            <div
              key={stat.id}
              className={`flex flex-col justify-between ${
                idx > 0 ? "sm:pl-4 lg:pl-6" : ""
              } ${idx >= 2 ? "pt-4 sm:pt-0" : ""}`}
            >
              <div>
                <div className="size-8 rounded-lg bg-indigo-50/80 flex items-center justify-center text-indigo-600 mb-2.5">
                  <Icon className="size-4 text-indigo-600" />
                </div>

                <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </div>

                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {stat.title}
                </div>
              </div>

              <div className="text-xs text-slate-400 font-normal mt-1">
                {stat.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
