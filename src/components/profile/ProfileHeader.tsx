"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  MapPin,
  Pencil,
  Settings,
  Share2,
  Trophy,
} from "lucide-react";
import { Profile } from "@/lib/types/profile/types";
import FollowButton from "@/components/profile/FollowButton";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
  /** Switches the page into edit mode. Absent on pages that don't host one. */
  onEdit?: () => void;
}

/**
 * The page header for a profile. The person's name *is* the page title, so
 * this carries the dashboard's standard header treatment rather than sitting
 * under a second, redundant one.
 */
export default function ProfileHeader({
  profile,
  backHref,
  onEdit,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy profile link:", err);
    }
  };

  return (
    <header className="space-y-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft size={14} />
          Back to profile
        </Link>
      ) : (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
        >
          <Link
            href="/dashboard"
            className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          >
            Dashboard
          </Link>
          <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-900 dark:text-slate-200">Profile</span>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
              {profile.displayName}
            </h1>

            {profile.isVerified && (
              <span
                title={profile.verifiedBadgeLabel ?? "Verified"}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              >
                <BadgeCheck size={13} />
                {profile.verifiedBadgeLabel ?? "Verified"}
              </span>
            )}

            {profile.rankBadgeLabel && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Trophy size={13} />
                {profile.rankBadgeLabel}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-slate-500 dark:text-slate-400">
            <span className="font-medium">@{profile.username}</span>

            {profile.location && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-slate-400" />
                  {profile.location}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Own profile leads with Edit; someone else's leads with Follow. */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {profile.isOwnProfile ? (
            <>
              {/* Edits happen in place, so this is a button rather than a
                  link — the URL stays on the profile being edited. */}
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                  <Pencil size={15} />
                  Edit profile
                </button>
              )}

              <Link
                href="/dashboard/profile/settings"
                aria-label="Account settings"
                title="Account settings"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings size={16} />
              </Link>
            </>
          ) : (
            <FollowButton />
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {copied ? (
              <Check size={16} className="text-emerald-600" />
            ) : (
              <Share2 size={16} className="text-slate-500" />
            )}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
