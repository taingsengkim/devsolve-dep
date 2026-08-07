"use client";

import { motion } from "motion/react";
import { ProfileStats } from "@/lib/types/profile/types";

interface StatsCardsProps {
  stats: ProfileStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Reputation", sub: "points", value: stats.reputation.toLocaleString(), color: "text-blue-600 dark:text-blue-400" },
    ...(stats.globalRank !== undefined
      ? [{ label: "Global Rank", sub: "leaderboard", value: `#${stats.globalRank}`, color: "text-slate-900 dark:text-slate-100" }]
      : []),
    { label: "Reports", sub: "submitted", value: stats.reportsSubmitted.toString(), color: "text-slate-900 dark:text-slate-100" },
    { label: "Accepted", sub: `${stats.acceptedRate}% rate`, value: stats.accepted.toString(), color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Total Earned", sub: "bounties", value: `$${stats.totalEarned.toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs transition-shadow hover:shadow-xs"
        >
          <p className={`text-2xl font-bold tracking-tight ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{card.label}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}