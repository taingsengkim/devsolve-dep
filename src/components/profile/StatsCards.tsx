import { ProfileStats } from "@/lib/types/profile/types";

interface StatsCardsProps {
  stats: ProfileStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Reputation", sub: "points", value: stats.reputation.toLocaleString(), color: "text-blue-600" },
    { label: "Global Rank", sub: "leaderboard", value: `#${stats.globalRank}`, color: "text-slate-900" },
    { label: "Reports", sub: "submitted", value: stats.reportsSubmitted.toString(), color: "text-slate-900" },
    { label: "Accepted", sub: `${stats.acceptedRate}% rate`, value: stats.accepted.toString(), color: "text-emerald-600" },
    { label: "Total Earned", sub: "bounties", value: `$${stats.totalEarned.toLocaleString()}`, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{card.label}</p>
          <p className="text-xs text-slate-400">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}