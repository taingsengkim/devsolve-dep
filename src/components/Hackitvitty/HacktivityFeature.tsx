"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGetHacktivityFeedQuery } from "@/lib/redux/services/hacktivityApi";
import SearchBar from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";

export default function HacktivityFeature() {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const searchParams = useMemo(
    () => (query.trim() ? { search: query.trim() } : undefined),
    [query]
  );

  const { data, isLoading, isError } = useGetHacktivityFeedQuery(searchParams);
  const activityStats = data?.stats ?? [];
  const activities = data?.activities ?? [];

  const filteredActivities = useMemo(() => {
    if (!selectedFilter) return activities;

    return activities.filter((activity) => {
      if (selectedFilter === "Bounty") {
        return Boolean(activity.bounty && activity.bounty !== "None");
      }
      return activity.severity === selectedFilter;
    });
  }, [activities, selectedFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:py-12 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Hacktivity
            </h1>
            <p className="mt-2.5 max-w-2xl text-base text-slate-600">
              Real-time stream of resolved vulnerabilities, hacker milestones, and community achievements — all in one public feed.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {activityStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs min-w-[120px]"
              >
                <div className="text-lg sm:text-xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Feed Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 rounded-2xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-xs"
        >
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity Stream</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Filter and search recent disclosure activity and bounties.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(["Critical", "Bounty", "High"] as const).map((option) => {
                const isActive = selectedFilter === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setSelectedFilter(isActive ? null : option)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all shadow-xs ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-5">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search researchers, programs, or vulnerabilities..."
            />
          </div>

          {/* Item Count */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span className="font-medium">{filteredActivities.length} activities found</span>
          </div>

          {/* Feed Content */}
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50/60 p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-slate-200" />
                        <div className="h-3 w-3/4 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-sm font-medium text-red-700">
                Failed to load hacktivity feed. Please try again later.
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
                No activity matches your search or filter.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((activity, i) => (
                  <motion.article
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                    className="group relative flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100">
                        <Image
                          src={activity.avatarUrl}
                          alt={`${activity.handle} avatar`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            @{activity.handle}
                          </span>
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold px-2.5 py-0.5"
                          >
                            {activity.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-700 leading-snug">
                          {activity.action}{" "}
                          <span className="font-semibold text-slate-900">
                            {activity.program}
                          </span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                          {activity.severity && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 font-semibold">
                              {activity.severity}
                            </span>
                          )}
                          {activity.bounty && (
                            <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 font-semibold">
                              {activity.bounty}
                            </span>
                          )}
                          {activity.paid && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5">
                              {activity.paid}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs font-medium text-slate-400 sm:self-start sm:mt-1 shrink-0">
                      <span>{activity.timeAgo}</span>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}