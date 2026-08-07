"use client";

import { useState } from "react";
import { User, Building2, Hash, UserCheck } from "lucide-react";
import { FollowRecord, FollowingCounts } from "@/lib/types/profile/types";
import FollowingItem from "./FollowingItem";

interface FollowingListProps {
  counts: FollowingCounts;
  items: FollowRecord[];
}

type FilterId = "hackers" | "orgs" | "topics";

function bucketOf(record: FollowRecord): FilterId {
  if (record.followableType === "USER") return "hackers";
  if (record.followableType === "ORGANIZATION") return "orgs";
  return "topics";
}

export default function FollowingList({ counts, items }: FollowingListProps) {
  const [filter, setFilter] = useState<FilterId>("hackers");

  const pills: { id: FilterId; label: string; count: number; icon: typeof User }[] = [
    { id: "hackers", label: "users", count: counts.hackers, icon: User },
    { id: "orgs", label: "orgs", count: counts.orgs, icon: Building2 },
    { id: "topics", label: "topics", count: counts.topics, icon: Hash },
  ];

  const filteredItems = items.filter((item) => bucketOf(item) === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Following</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Users, organizations, and security topics you follow on DevSolve.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => {
            const Icon = pill.icon;
            const isActive = filter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilter(pill.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs"
                }`}
              >
                <Icon size={14} />
                <span className="capitalize">{pill.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <FollowingItem key={item.id} record={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-3">
              <UserCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No {filter} followed yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              When you follow users, organizations, or security topics, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}