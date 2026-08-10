"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CommunityPost, CommunityPostTag } from "@/lib/types/profile/types";
import CommunityPostCard from "./CommunityPostCard";

/**
 * Everything one person has posted — problems, solutions and showcases, from
 * the three portfolio endpoints — behind a filter, since a busy profile is
 * usually read looking for one kind of thing.
 *
 * The filter is client-side on purpose: the three lists are already merged and
 * sorted by date, and re-fetching per tab would lose that ordering.
 */

type Filter = "All" | CommunityPostTag;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Problem", label: "Problems" },
  { value: "Solutions", label: "Solutions" },
  { value: "Showcase", label: "Showcases" },
];

interface CommunityTabProps {
  posts: CommunityPost[];
}

export default function CommunityTab({ posts }: CommunityTabProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(
    () => ({
      All: posts.length,
      Problem: posts.filter((post) => post.tag === "Problem").length,
      Solutions: posts.filter((post) => post.tag === "Solutions").length,
      Showcase: posts.filter((post) => post.tag === "Showcase").length,
    }),
    [posts],
  );

  const visible = useMemo(
    () => (filter === "All" ? posts : posts.filter((post) => post.tag === filter)),
    [filter, posts],
  );

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        No problems, solutions, or showcases posted yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Filter posts"
        className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
      >
        {FILTERS.map((option) => {
          const isActive = filter === option.value;
          const count = counts[option.value];

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={isActive}
              disabled={count === 0}
              className={`relative cursor-pointer rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="community-filter-pill"
                  className="absolute inset-0 rounded-xl bg-blue-600"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {option.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          Nothing under this filter yet.
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((post) => (
            <CommunityPostCard key={`${post.tag}-${post.id}`} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
