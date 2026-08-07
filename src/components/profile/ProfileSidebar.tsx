import { Profile, ProfileStats } from "@/lib/types/profile/types";

interface ProfileSidebarProps {
  profile: Profile;
  stats: ProfileStats;
}

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
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 py-1.5 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <span
        className={`text-sm font-bold tabular-nums ${
          tone === "positive"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProfileSidebar({ profile, stats }: ProfileSidebarProps) {
  return (
    /* Row on phones and tablets, column once the sidebar has its own track.
       A full-width `aspect-square` avatar meant a 390px-tall photo on a phone
       and a ~700px one on a tablet — a whole screen of scrolling before any
       content. */
    <div className="flex flex-row items-start gap-5 lg:flex-col lg:gap-6">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs sm:size-32 lg:aspect-square lg:h-auto lg:w-full dark:border-slate-800 dark:bg-slate-800">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URL, not in next/image's remote host allowlist
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-600 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {profile.avatarInitials}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-3 lg:w-full lg:flex-none">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Stats</span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-800" />
        </div>

        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
            {stats.reputation.toLocaleString()}
          </p>
          <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Reputation Points
          </p>
        </div>

        {stats.globalRank !== undefined && (
          <StatRow label="Global Rank" value={`#${stats.globalRank}`} />
        )}
        <StatRow
          label="Reports Submitted"
          value={stats.reportsSubmitted.toLocaleString()}
        />
        <StatRow
          label="Accepted Rate"
          value={`${stats.acceptedRate}%`}
          tone="positive"
        />
        <StatRow
          label="Total Earned"
          value={`$${stats.totalEarned.toLocaleString()}`}
          tone="positive"
        />
      </div>
    </div>
  );
}
