"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
    <div className="min-h-screen bg-[#F8FBFF] py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8 lg:px-10">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes shimmer {
          from {
            background-position: -200% 0;
          }
          to {
            background-position: 200% 0;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #eef2f7 25%, #f8fbff 50%, #eef2f7 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-600 sm:text-4xl md:text-5xl lg:text-5xl animate-fade-in-up">
              Hacktivity
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base animate-fade-in-up" style={{ animationDelay: "80ms" }}>
              Real-time stream of resolved vulnerabilities, hacker milestones, and community achievements — all in one public feed.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-start gap-x-4 gap-y-4 text-left sm:flex-nowrap sm:gap-x-5 md:gap-x-6">
            {activityStats.map((stat, i) => (
              <div
                key={stat.label}
                className="min-w-[110px] flex-none text-left animate-fade-in-up"
                style={{ animationDelay: `${120 + i * 60}ms` }}
              >
                <div className="text-base font-extrabold text-slate-900 sm:text-lg md:text-lg lg:text-xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] font-medium tracking-widest text-slate-400 whitespace-nowrap md:mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed card */}
        <div className="mt-8 rounded-3xl bg-white p-4 shadow-sm border border-slate-200 sm:p-5 md:mt-10 md:p-6 mb-5">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Hacktivity</h2>
              <p className="mt-1 text-sm text-slate-500">Search researcher names, platforms, or vulnerability types.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1 font-medium text-[11px] tracking-[0.2em] text-slate-400 sm:gap-2 sm:text-xs sm:tracking-[0.25em] md:mt-0">
              {(["Critical", "Bounty", "High"] as const).map((option) => {
                const isActive = selectedFilter === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setSelectedFilter(isActive ? null : option)}
                    className={`rounded-full px-2 py-1 transition-colors duration-150 sm:px-2.5 sm:py-1.5 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full rounded-3xl mt-4 sm:mt-5">
            <SearchBar value={query} onChange={setQuery} placeholder="Search researchers..." />
          </div>

          <div className="mt-4 flex justify-start sm:mt-5">
            <span className="text-xs text-slate-500 px-2 py-1 sm:px-2.5 sm:py-1.5 sm:text-sm">
              {filteredActivities.length} activities
            </span>
          </div>

          <div className="mt-4 space-y-3 sm:mt-5">
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-full rounded-3xl border border-slate-200 bg-white p-3 animate-fade-in"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-9 w-9 shrink-0 rounded-full animate-shimmer" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3.5 w-32 rounded-full animate-shimmer" />
                        <div className="h-3.5 w-2/3 rounded-full animate-shimmer" />
                        <div className="h-3 w-40 rounded-full animate-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm animate-fade-in">
                Failed to load hacktivity feed.
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 text-center text-slate-600 shadow-sm animate-fade-in">
                No activity matches your search.
              </div>
            ) : (
              filteredActivities.map((activity, i) => (
                <article
                  key={activity.id}
                  className="w-full flex flex-col gap-2 rounded-3xl border border-slate-200 bg-[#F8FBFF] p-3 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:p-2.5 md:gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
                >
                  <div className="w-full flex min-w-0 items-start gap-2.5">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={activity.avatarUrl}
                        alt={`${activity.handle} profile`}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                        <span className="truncate">{activity.handle}</span>
                        <Badge
                          variant="default"
                          className="rounded-full bg-[#EFF6FF] text-[#155DFC] px-2 py-0.5 text-[11px] tracking-[0.18em]"
                        >
                          {activity.label}
                        </Badge>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-700">
                        {activity.action} for <span className="font-normal text-slate-700">{activity.program}</span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5">{activity.severity}</span>
                        <span className="px-2 py-0.5">{activity.bounty}</span>
                        <span className="px-2 py-0.5">{activity.paid}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-start gap-1 text-xs text-slate-500 sm:w-auto sm:items-end sm:justify-end">
                    <span className="whitespace-nowrap">{activity.timeAgo}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}