
import { LeaderboardStats } from "@/lib/types/leaderboard/types";

interface LeaderboardHeroProps {
  stats: LeaderboardStats;
}

export default function LeaderboardHero({ stats }: LeaderboardHeroProps) {
  const statCards = [
    { value: stats.activeResearchers.toLocaleString(), label: "Active Researchers" },
    { value: stats.validReports.toLocaleString(), label: "Valid Reports" },
    { value: stats.programsLive.toLocaleString(), label: "Programs Live" },
  ];

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Community Recognition</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Leaderboard</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          The researchers who make the internet safer — ranked by reputation score, accepted reports, and critical findings.
        </p>
      </div>

      <div className="flex gap-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{stat.value}</p>
            <p className="text-xs text-slate-500 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
