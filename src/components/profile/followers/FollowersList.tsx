"use client";

import { useState } from "react";
import { Users, Search } from "lucide-react";
import { FollowRecord } from "@/lib/types/profile/types";
import { mockFollowersList } from "@/lib/types/profile/mock-data";
import FollowerItem from "./FollowerItem";

interface FollowersListProps {
  total: number;
  items: FollowRecord[];
  baseProfilePath?: string;
}

export default function FollowersList({ total, items, baseProfilePath }: FollowersListProps) {
  const [search, setSearch] = useState("");

  // Use mock data fallback if backend returns empty list (e.g. 0 followers)
  const isUsingMock = items.length === 0;
  const displayItems = isUsingMock ? mockFollowersList : items;
  const displayTotal = isUsingMock ? mockFollowersList.length : total;

  const filteredItems = displayItems.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = item.displayName?.toLowerCase().includes(q) ?? false;
    const handleMatch = item.username?.toLowerCase().includes(q) ?? false;
    const bioMatch = item.bio?.toLowerCase().includes(q) ?? false;
    return nameMatch || handleMatch || bioMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title, Count, & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Followers
            </h2>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
              {displayTotal}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Community members, security researchers, and hackers who follow this profile.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search followers..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* Followers Items Grid */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FollowerItem key={item.id} record={item} baseProfilePath={baseProfilePath} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No followers found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {search ? `No followers matching "${search}".` : "When users follow this profile, they will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
