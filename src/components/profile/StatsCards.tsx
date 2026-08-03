"use client";

import { motion } from "motion/react";
import { ProfileStats } from "@/lib/types/profile/types";

interface StatsCardsProps {
  stats: ProfileStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Reputation", sub: "points", value: stats.reputation.toLocaleString(), color: "text-blue-600" },
    // No leaderboard/rank endpoint exists yet, so this card is omitted rather
    // than showing a fabricated rank.
    ...(stats.globalRank !== undefined
      ? [{ label: "Global Rank", sub: "leaderboard", value: `#${stats.globalRank}`, color: "text-slate-900" }]
      : []),
    { label: "Reports", sub: "submitted", value: stats.reportsSubmitted.toString(), color: "text-slate-900" },
    { label: "Accepted", sub: `${stats.acceptedRate}% rate`, value: stats.accepted.toString(), color: "text-emerald-600" },
    { label: "Total Earned", sub: "bounties", value: `$${stats.totalEarned.toLocaleString()}`, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-shadow hover:shadow-xs"
        >
          <p className={`text-2xl font-bold tracking-tight ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{card.label}</p>
          <p className="text-xs font-medium text-slate-400">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}