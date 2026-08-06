"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Trophy } from "lucide-react";
import LeaderboardClient from "@/components/Leaderboard/LeaderboardClient";
import PointsLegend from "@/components/Leaderboard/PointsLegend";

export default function DashboardLeaderboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Leaderboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Researcher Leaderboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              <Trophy className="size-3.5" aria-hidden />
              Reputation
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ranked on reputation points from valid findings and the recognitions
            companies gave them — never on payout size.
          </p>
        </div>

        <PointsLegend className="sm:justify-end" />
      </header>

      <LeaderboardClient />
    </motion.div>
  );
}
