"use client";

import React from "react";

const BLOCK_CLASS = "rounded-lg bg-muted";

export function DiscussionSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading discussions"
      className="flex animate-pulse flex-col gap-5"
    >
      <span className="sr-only">Loading discussions…</span>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-xs ring-1 ring-foreground/5 sm:p-6"
        >
          <div className="flex gap-2">
            <div className={`h-6 w-18 ${BLOCK_CLASS}`} />
            <div className={`h-6 w-28 ${BLOCK_CLASS}`} />
            <div className={`h-6 w-20 ${BLOCK_CLASS}`} />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className={`h-6 w-4/5 ${BLOCK_CLASS}`} />
            <div className="flex flex-col gap-2">
              <div className={`h-4 w-full ${BLOCK_CLASS}`} />
              <div className={`h-4 w-3/4 ${BLOCK_CLASS}`} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, tagIndex) => (
              <div
                key={tagIndex}
                className={`h-7 w-16 ${BLOCK_CLASS}`}
              />
            ))}
          </div>

          <div className="h-px bg-border/50" />

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className={`size-6 rounded-full bg-muted`} />
              <div className={`h-4 w-28 ${BLOCK_CLASS}`} />
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-4 w-16 ${BLOCK_CLASS}`} />
              <div className={`h-4 w-16 ${BLOCK_CLASS}`} />
              <div className={`h-8 w-16 rounded-xl bg-muted`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
