"use client";

import { motion } from "motion/react";

/**
 * Loading skeleton that mirrors the GitHub-style two-column profile layout:
 * sticky left sidebar + right tab content area.
 */
export default function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full space-y-6 pb-12"
    >
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Two-column body */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Left sidebar skeleton */}
        <div className="w-full shrink-0 space-y-4 lg:w-64 xl:w-72">
          {/* Avatar circle */}
          <div className="mx-auto aspect-square w-full max-w-[260px] animate-pulse rounded-full bg-slate-200 lg:mx-0 dark:bg-slate-800" />

          {/* Action buttons */}
          <div className="space-y-2">
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Name + username */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <div className="h-3.5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Followers row */}
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          {/* Info rows */}
          <div className="space-y-2.5 border-t border-slate-200/80 pt-4 dark:border-slate-800">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="size-4 shrink-0 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div
                  className="h-3.5 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
                  style={{ width: `${60 + i * 8}%` }}
                />
              </div>
            ))}
          </div>

          {/* Stats rows */}
          <div className="space-y-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
            <div className="h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Right content skeleton */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Tab bar */}
          <div className="flex gap-6 border-b border-slate-200/80 pb-3 dark:border-slate-800">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
                style={{ width: `${48 + i * 12}px` }}
              />
            ))}
          </div>

          {/* Stats cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>

          {/* Severity / badges placeholder */}
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </motion.div>
  );
}
