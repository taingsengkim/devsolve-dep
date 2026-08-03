"use client";

import React from "react";

export function DiscussionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-pulse">
      {/* Feed column */}
      <div className="lg:col-span-3 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs"
          >
            {/* Vote pillar */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="h-12 w-10 rounded-xl bg-slate-100" />
            </div>
            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-5 bg-slate-100 rounded-lg w-20 shrink-0" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-5/6" />
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-5 w-14 bg-slate-100 rounded-lg" />
                ))}
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-slate-100 rounded" />
                  <div className="h-4 w-12 bg-slate-100 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-slate-100" />
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Topics */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-2">
          <div className="h-5 w-24 bg-slate-100 rounded mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded-xl" />
          ))}
        </div>
        {/* Tags */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="h-5 w-28 bg-slate-100 rounded mb-4" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-6 w-14 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Stats */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
          <div className="h-5 w-28 bg-slate-100 rounded mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-4 w-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
