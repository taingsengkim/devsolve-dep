"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Clock,
  ChevronRight,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminActionQueueItem } from "@/lib/types/admin/types";

/** Lookup map from action type → icon */
const ACTION_ICONS: Record<AdminActionQueueItem["type"], LucideIcon> = {
  verification: Building2,
  report_confirmation: FileCheck,
  moderation: ShieldAlert,
  user_review: Users,
};

interface AdminActionQueueCardProps {
  items: AdminActionQueueItem[];
  totalCount: number;
}

export function AdminActionQueueCard({ items, totalCount }: AdminActionQueueCardProps) {
  return (
    <Card className="lg:col-span-7 rounded-[20px] border border-slate-200/70 bg-white shadow-2xs">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="size-5 text-amber-500" />
              Admin Action Queue
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-0.5">
              Tasks requiring platform administrator approval or review
            </CardDescription>
          </div>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {totalCount} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {items.map((item) => {
          const Icon = ACTION_ICONS[item.type];
          return (
            <Link key={item.id} href={item.linkHref} className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition group cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center ${
                      item.status === "urgent"
                        ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                        : item.status === "pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                        : "bg-blue-50 text-blue-600 border border-blue-200/60"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      item.status === "urgent"
                        ? "bg-rose-600 text-white"
                        : item.status === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.count} items
                  </Badge>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
