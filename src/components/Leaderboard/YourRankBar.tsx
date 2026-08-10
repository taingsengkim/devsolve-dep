"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Crosshair } from "lucide-react";
import { LeaderboardEntry, LeaderboardPeriod } from "@/lib/types/leaderboard/types";
import ResearcherAvatar from "./ResearcherAvatar";
import RankMovement from "./RankMovement";
import { PERIOD_LABEL_SHORT, formatNumber, profileHref } from "./leaderboard-ui";

type Props = {
  entry: LeaderboardEntry | null;
  totalRanked: number;
  topPercent: number | null;
  period: LeaderboardPeriod;
  /** Present only when the row survives the active filters. */
  onJumpToMe?: () => void;
};

/**
 * Pinned so the board means something to everyone, not just the top ten.
 * Sticks to the bottom of the viewport while the ranking scrolls past.
 */
export default function YourRankBar({
  entry,
  totalRanked,
  topPercent,
  period,
  onJumpToMe,
}: Props) {
  if (!entry) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
      aria-label="Your position on the leaderboard"
      className="sticky bottom-4 z-30"
    >
      <div className="flex flex-col gap-4 rounded-2xl bg-[#1E293B] p-4 text-white shadow-[0_18px_44px_-20px_rgba(30,41,59,0.9)] sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:bg-neutral-800 dark:shadow-[0_18px_44px_-20px_rgba(0,0,0,0.9)] dark:ring-1 dark:ring-white/10">
        <div className="flex min-w-0 items-center gap-4">
          <ResearcherAvatar
            username={entry.username}
            displayName={entry.displayName}
            avatarUrl={entry.avatarUrl}
            initials={entry.avatarInitials}
            size={44}
            className="ring-2 ring-white/20"
          />
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-bold tracking-tight">
              You&apos;re #{formatNumber(entry.rank)}
              <span className="text-sm font-medium text-slate-400 dark:text-neutral-400">
                of {formatNumber(totalRanked)} · {PERIOD_LABEL_SHORT[period].toLowerCase()}
              </span>
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300 dark:text-neutral-300">
              <span className="font-semibold text-white">
                {formatNumber(entry.reputation)} pts
              </span>
              <span className="text-slate-500 dark:text-neutral-500">·</span>
              <span>{formatNumber(entry.validReports)} valid</span>
              <span className="text-slate-500 dark:text-neutral-500">·</span>
              <span>{formatNumber(entry.criticalReports)} critical</span>
              <span className="text-slate-500 dark:text-neutral-500">·</span>
              <span>{formatNumber(entry.recognitionCount)} thanks</span>
              {topPercent != null && (
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-semibold">
                  Top {topPercent}%
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <RankMovement
            rank={entry.rank}
            previousRank={entry.previousRank}
            tone="dark"
            className="rounded-lg bg-white/10 px-2 py-1"
          />

          {onJumpToMe && (
            <button
              type="button"
              onClick={onJumpToMe}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Crosshair className="h-4 w-4" aria-hidden />
              My row
            </button>
          )}

          <Link
            href={profileHref(entry.username)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            My profile
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
