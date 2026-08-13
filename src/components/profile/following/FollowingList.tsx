"use client";

import { useState } from "react";
import { Search, UserCheck } from "lucide-react";
import { FollowingUser } from "@/lib/types/profile/types";
import FollowingItem from "./FollowingItem";

interface FollowingListProps {
  totalUsers: number;
  items: FollowingUser[];
  baseProfilePath?: string;
}

export default function FollowingList({
  totalUsers,
  items,
  baseProfilePath,
}: FollowingListProps) {
  const [search, setSearch] = useState("");
  const [hiddenUserIds, setHiddenUserIds] = useState<string[]>([]);

  const filteredItems = items
    .filter((item) => !hiddenUserIds.includes(item.userId))
    .filter((item) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      const nameMatch = item.fullName.toLowerCase().includes(q);
      const bioMatch = item.biography?.toLowerCase().includes(q) ?? false;
      return nameMatch || bioMatch;
    });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Following
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              People you follow on DevSolve.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search following..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:focus:border-blue-500"
            />
          </div>
        </div>

        <p className="pt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
          {totalUsers} {totalUsers === 1 ? "person" : "people"}
        </p>
      </div>

      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FollowingItem
              key={item.userId}
              user={item}
              baseProfilePath={baseProfilePath}
              onUnfollow={(userId) =>
                setHiddenUserIds((current) =>
                  current.includes(userId) ? current : [...current, userId],
                )
              }
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-3">
              <UserCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {search ? "No users found" : "You're not following any users yet."}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {search
                ? `No users match "${search}".`
                : "When you follow researchers, they will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
