"use client";

import { Profile, ProfileStats } from "@/lib/types/profile/types";

interface ProfileSidebarProps {
  profile: Profile;
  stats: ProfileStats;
}

/** One row of the stat list — keeps label/value alignment identical throughout. */
function StatRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 py-2 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={
          tone === "positive"
            ? "text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums"
            : "text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function ProfileSidebar({
  profile,
  stats,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-5 lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Avatar */}
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URL, not in next/image's remote host allowlist
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-4xl font-bold text-white">
              {profile.avatarInitials}
            </div>
          )}
        </div>

      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Stats
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-800" />
        </div>

        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
            {stats.reputation.toLocaleString()}
          </p>
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Reputation points
          </p>
        </div>

        {stats.globalRank !== undefined && (
          <StatRow label="Global rank" value={`#${stats.globalRank}`} />
        )}
        <StatRow
          label="Reports submitted"
          value={stats.reportsSubmitted.toLocaleString()}
        />
        <StatRow
          label="Accepted rate"
          value={`${stats.acceptedRate}%`}
          tone="positive"
        />
        <StatRow
          label="Total earned"
          value={`$${stats.totalEarned.toLocaleString()}`}
          tone="positive"
        />
      </div>
    </div>
  );
}
