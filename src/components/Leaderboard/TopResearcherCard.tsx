import { Award, Bug, Trophy, Zap, RotateCcw } from "lucide-react";
import { LeaderboardBadgeLabel, Researcher } from "@/lib/types/leaderboard/types";

interface TopResearcherCardProps {
  researcher: Researcher;
}

const BADGE_CONFIG: Record<
  LeaderboardBadgeLabel,
  { icon: typeof Trophy; color: string; bg: string; border: string }
> = {
  "Top 10": {
    icon: Trophy,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
  },
  "Bug Slayer": {
    icon: Bug,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
  },
  "Speed Hacker": {
    icon: Zap,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200/60",
  },
  "First Blood": {
    icon: Zap,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200/60",
  },
  "Retest Pro": {
    icon: RotateCcw,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200/60",
  },
};

export default function TopResearcherCard({ researcher }: TopResearcherCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300">
      {/* Top Header Section */}
      <div>
        <div className="flex items-center justify-between">
          {researcher.avatarUrl ? (
          <img
            src={researcher.avatarUrl}
            alt={`${researcher.handle} avatar`}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white ring-2 ring-white">
            {researcher.avatarInitials}
          </div>
        )}
          
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
            <Award size={18} />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4">
          <h3 className="truncate text-base font-bold tracking-tight text-slate-900">
            {researcher.handle}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <img
              src={`https://flagcdn.com/w20/${researcher.countryCode.toLowerCase()}.png`}
              alt={researcher.countryCode}
              className="h-3.5 w-5 rounded-[2px] border border-slate-200/80 object-cover"
            />
            <span className="truncate">{researcher.realName}</span>
          </div>
        </div>

        {/* Metric Display */}
        <div className="mt-4 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {researcher.reputation.toLocaleString()}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              pts
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">Total Reputation</p>
        </div>
      </div>

      {/* Badges Container */}
      {researcher.badges && researcher.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
          {researcher.badges.map((badge) => {
            const config = BADGE_CONFIG[badge] || {
              icon: Trophy,
              color: "text-slate-700",
              bg: "bg-slate-50",
              border: "border-slate-200",
            };
            const Icon = config.icon;

            return (
              <span
                key={badge}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.color} ${config.border}`}
              >
                <Icon size={12} className="shrink-0" />
                {badge}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}