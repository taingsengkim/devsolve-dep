"use client";

import { useState } from "react";
import { User, Building2, Hash } from "lucide-react";
import { FollowedHacker, FollowingCounts } from "@/lib/types/profile/types";
import FollowingItem from "./FollowingItem";

interface FollowingListProps {
  counts: FollowingCounts;
  hackers: FollowedHacker[];
}

type FilterId = "hackers" | "orgs" | "topics";

export default function FollowingList({ counts, hackers }: FollowingListProps) {
  const [filter, setFilter] = useState<FilterId>("hackers");

  const pills: { id: FilterId; label: string; count: number; icon: typeof User }[] = [
    { id: "hackers", label: "hackers", count: counts.hackers, icon: User },
    { id: "orgs", label: "orgs", count: counts.orgs, icon: Building2 },
    { id: "topics", label: "topics", count: counts.topics, icon: Hash },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Following</h2>
          <p className="mt-1 text-sm text-slate-500">Hackers, organizations, and security topics you follow on DevSolve.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => {
            const Icon = pill.icon;
            const isActive = filter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilter(pill.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} />
                {pill.count} {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filter === "hackers" ? (
          hackers.length > 0 ? (
            hackers.map((hacker) => <FollowingItem key={hacker.id} hacker={hacker} />)
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
              Not following any hackers yet.
            </p>
          )
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            No {filter} followed yet.
          </p>
        )}
      </div>
    </div>
  );
}