import { ArrowLeft, BadgeCheck, Settings, Trophy, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Profile } from "@/lib/types/profile/types";
import FollowButton from "@/components/profile/FollowButton";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
}

export default function ProfileHeader({ profile, backHref = "/dashboard" }: ProfileHeaderProps) {
  return (
    <div>
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden rounded-b-none rounded-t-2xl bg-gradient-to-b from-[#0a1628] via-[#173a6b] to-[#2f6fd6] sm:h-48">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />
        <Link
          href={backHref}
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* <div className="absolute right-4 top-4">
          {profile.isOwnProfile ? (
            <Link
              href="/dashboard/profile/settings"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              <Settings size={15} />
              Settings
            </Link>
          ) : null}
        </div> */}  
      </div>

      {/* Identity row */}
      <div className="relative flex flex-col gap-4 px-1 pb-2 pt-0 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white text-2xl font-bold text-blue-600 shadow-md sm:h-28 sm:w-28">
            {profile.avatarInitials}
          </div>

          <div className="pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{profile.displayName}</h1>
              {/* {profile.isVerified && <BadgeCheck size={20} className="text-blue-600" />}
              {profile.rankBadgeLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <Trophy size={12} />
                  {profile.rankBadgeLabel}
                </span>
              )}
              {profile.verifiedBadgeLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={12} />
                  {profile.verifiedBadgeLabel}
                </span>
              )} */}
            </div>
            <p className="mt-0.5 text-sm text-slate-500">@{profile.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 pb-1 sm:pb-2 mr-6">
          <div className="text-center">
            <p className="text-base font-bold text-slate-900">{profile.followers}</p>
            <p className="text-xs text-slate-500">Followers</p>
          </div>
          <Link href={`/dashboard/profile/${profile.username}/following`} className="text-center transition hover:opacity-70">
            <p className="text-base font-bold text-slate-900">{profile.following}</p>
            <p className="text-xs text-slate-500">Following</p>
          </Link>

          {profile.isOwnProfile ? (
            <Link
              href="/dashboard/profile/settings"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:inline-flex"
            >
              <Settings size={15} />
              Settings
            </Link>
          ) : (
            <FollowButton />
          )}
        </div>
      </div>
    </div>
  );
}