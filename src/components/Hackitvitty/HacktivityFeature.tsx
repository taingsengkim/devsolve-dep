"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useGetHacktivityFeedQuery } from "@/lib/redux/services/hacktivityApi";
import SearchBar from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";

export default function HacktivityFeature() {
  const [query, setQuery] = useState("");
  const searchParams = useMemo(
    () => (query.trim() ? { search: query.trim() } : undefined),
    [query]
  );

  const { data, isLoading, isError } = useGetHacktivityFeedQuery(searchParams);
  const activityStats = data?.stats ?? [];
  const activities = data?.activities ?? [];

  return (
    <div className="min-h-screen bg-[#F8FBFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-32 xl:grid-cols-[minmax(0,1fr)_350px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700" />
              Live platform activity
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Hacktivity
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Real-time stream of resolved vulnerabilities, hacker milestones, and community achievements — all in one public feed.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            {activityStats.map((stat) => (
              <div key={stat.label} className="px-0 py-4">
                <div className="mt-2 text-xl font-bold mb-2 text-slate-900">{stat.value}</div>
                <div className="text-xs font-medium tracking-widest text-slate-400 whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

         

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Hacktivity</h2>
              <p className="mt-1 text-sm text-slate-500">Search researcher names, platforms, or vulnerability types.</p>
            </div>
            <div className="w-full max-w-xl">
              <SearchBar value={query} onChange={setQuery} placeholder="Search researchers..." />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1.5">Critical</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1.5">Bounty</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1.5">High</span>
            <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1.5">{activities.length} activities</span>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 text-center text-slate-600 shadow-sm">
                Loading hacktivity feed...
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
                Failed to load hacktivity feed.
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 text-center text-slate-600 shadow-sm">
                No activity matches your search.
              </div>
            ) : (
              activities.map((activity) => (
                <article
                  key={activity.id}
                  className="w-full flex flex-col gap-2 rounded-3xl border border-slate-200 bg-[#F8FBFF] p-2.5 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="w-full flex min-w-0 items-start gap-2.5">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full">
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
                        <Badge variant="default" className="rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[11px] uppercase tracking-[0.18em]">
                          {activity.label}
                        </Badge>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-700">
                        {activity.action} for <span className="font-semibold text-slate-900">{activity.program}</span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5">{activity.severity}</span>
                        <span className="px-2 py-0.5">{activity.bounty}</span>
                        <span className="px-2 py-0.5">{activity.paid}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1 text-xs text-slate-500 sm:items-end">
                    <span>{activity.timeAgo}</span>
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
                  
