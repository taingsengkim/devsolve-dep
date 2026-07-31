import Image from "next/image";
import { Profile, ProfileStats } from "@/lib/types/profile/types";

interface ProfileSidebarProps {
  profile: Profile;
  stats: ProfileStats;
}

export default function ProfileSidebar({ profile, stats }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Avatar Picture */}
      <div className="w-full aspect-square rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative bg-slate-100">
        <Image
          src={profile.avatarUrl || "/justin.png"}
          alt={profile.displayName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Stats Divider Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Stats</span>
          <div className="h-px flex-1 bg-slate-200/80" />
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-bold text-slate-700 text-2xl tracking-tight">{stats.reputation.toLocaleString()}</p>
            <p className="text-sm text-slate-500 font-medium">Reputation Points</p>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Global Rank</span>
            <span className="text-sm font-bold text-slate-600">#{stats.globalRank}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Reports Submitted</span>
            <span className="text-sm font-bold text-slate-600">{stats.reportsSubmitted}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Accepted Rate</span>
            <span className="text-sm font-bold text-emerald-600">{stats.acceptedRate}%</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Total Earned</span>
            <span className="text-sm font-bold text-emerald-600">${stats.totalEarned.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
