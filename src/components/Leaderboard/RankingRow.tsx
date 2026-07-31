import { Award, Bug, RotateCcw, Zap } from "lucide-react";
import { LeaderboardBadgeLabel, Researcher } from "@/lib/types/leaderboard/types";

interface RankingRowProps {
  researcher: Researcher;
}

const BADGE_ICON: Record<LeaderboardBadgeLabel, typeof Award> = {
  "Top 10": Award,
  "Bug Slayer": Bug,
  "Speed Hacker": Zap,
  "First Blood": Zap,
  "Retest Pro": RotateCcw,
};

const BADGE_STYLE: Record<LeaderboardBadgeLabel, string> = {
  "Top 10": "bg-amber-50 text-amber-700",
  "Bug Slayer": "bg-emerald-50 text-emerald-700",
  "Speed Hacker": "bg-blue-50 text-blue-700",
  "First Blood": "bg-rose-50 text-rose-700",
  "Retest Pro": "bg-indigo-50 text-indigo-700",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
];

function avatarColorFor(id: string) {
  const index = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function RankingRow({ researcher }: RankingRowProps) {
  return (
    <div className="grid grid-cols-[40px_1fr_110px_90px_70px] items-center gap-4 border-b border-slate-100 px-2 py-4 last:border-0 sm:px-4">
      <span className="text-sm font-medium text-slate-400">{researcher.rank}</span>
      <div className="flex min-w-0 items-center gap-3">
        {researcher.avatarUrl ? (
          <img
            src={researcher.avatarUrl}
            alt={`${researcher.handle} avatar`}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColorFor(researcher.id)}`}>
            {researcher.avatarInitials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{researcher.handle}</p>
          <p className="flex items-center truncate text-xs text-slate-500">
            <img
              src={`https://flagcdn.com/w20/${researcher.countryCode.toLowerCase()}.png`}
              alt={researcher.countryCode}
              title={researcher.countryCode}
              className="mr-2 h-4 w-6 rounded-sm border border-slate-200/80 object-cover"
            />
            {researcher.realName}
          </p>
        </div>
        <div>
          {researcher.badges.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {researcher.badges.map((badge) => {
                const Icon = BADGE_ICON[badge];
                return (
                  <span key={badge} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_STYLE[badge]}`}>
                    <Icon size={10} />
                    {badge}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="text-right text-sm font-semibold text-slate-900">
        {researcher.reputation.toLocaleString()} <span className="font-normal text-slate-400">pts</span>
      </p>
      <p className="text-right text-sm text-slate-700">{researcher.accepted}</p>
      <p className={`text-right text-sm font-semibold ${researcher.critical > 0 ? "text-rose-600" : "text-slate-400"}`}>
        {researcher.critical}
      </p>
    </div>
  );
}
