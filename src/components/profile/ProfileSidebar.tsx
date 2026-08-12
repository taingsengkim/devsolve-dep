"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Link2,
  Pencil,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Profile, ProfileStats } from "@/lib/types/profile/types";
import FollowButton from "@/components/profile/FollowButton";

import ReactMarkdown from "react-markdown";

import { isUuid } from "@/components/Leaderboard/leaderboard-ui";

interface ProfileSidebarProps {
  profile: Profile;
  stats: ProfileStats;
  /** Switches the page into edit mode. Absent on pages that don't host one. */
  onEdit?: () => void;
  baseProfilePath?: string;
}

function toHref(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function displayUrl(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

const infoIconClass = "size-4 shrink-0 text-slate-500 dark:text-neutral-400";
const infoLinkClass =
  "flex min-w-0 items-center gap-2 text-sm text-slate-600 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 transition-colors";
const infoTextClass =
  "flex min-w-0 items-center gap-2 text-sm text-slate-600 dark:text-neutral-300";

export default function ProfileSidebar({
  profile,
  stats,
  onEdit,
  baseProfilePath,
}: ProfileSidebarProps) {
  const {
    avatarUrl,
    avatarInitials,
    displayName,
    username,
    bio,
    memberSince,
    socialLinks,
    followers,
    following,
    isOwnProfile,
  } = profile;

  const profileBasePath = baseProfilePath ?? `/dashboard/profile/${username}`;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* ── Avatar ───────────────────────────────────── */}
      <div className="relative flex justify-center lg:justify-start">
        <div className="relative aspect-square size-28 sm:size-36 lg:size-48 xl:size-56 overflow-hidden rounded-full border-2 border-slate-200/80 bg-slate-100 shadow-xs ring-4 ring-white dark:border-neutral-700 dark:bg-neutral-800 dark:ring-neutral-950 shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {avatarInitials}
            </div>
          )}
        </div>
      </div>

      {/* ── Name & Bio ───────────────────────────────── */}
      <div className="space-y-1 text-center lg:text-left">
        <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-slate-900 wrap-break-word dark:text-neutral-100">
          {displayName}
        </h1>
        {/* The API carries no username: it is derived from the email, which
            only the signed-in user's own profile returns. So it is blank for
            everyone else, and a bare "@" is worse than no line at all. */}
        {username && !isUuid(username) && (
          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-neutral-400">
            @{username}
          </p>
        )}
      </div>


      {/* ── Actions ──────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-1">
        {isOwnProfile ? (
          <>
            {onEdit && (
              <button
                type="button"
                id="profile-edit-btn"
                onClick={onEdit}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Pencil size={14} />
                Edit profile
              </button>
            )}
            <Link
              href="/dashboard/profile/settings"
              id="profile-settings-link"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Settings size={14} />
              Account settings
            </Link>
          </>
        ) : (
          <FollowButton type="USER" targetId={profile.id} className="w-full" />
        )}
      </div>

      {bio && (
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-neutral-300 wrap-break-word">
          <ReactMarkdown>{bio}</ReactMarkdown>
        </div>
      )}

      {/* ── Followers / Following ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 pt-1">
        <Link
          href={`${profileBasePath}/followers`}
          id="profile-followers-link"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-400"
        >
          <Users size={15} className="text-slate-500 dark:text-neutral-400" />
          <span>
            <span className="font-bold text-slate-900 dark:text-neutral-100">
              {followers.toLocaleString()}
            </span>{" "}
            <span className="text-slate-500 dark:text-neutral-400">followers</span>
          </span>
        </Link>
        <span className="text-slate-300 dark:text-neutral-700">·</span>
        <Link
          href={`${profileBasePath}/following`}
          id="profile-following-link"
          className="text-sm font-semibold transition-colors hover:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-400"
        >
          <span className="font-bold text-slate-900 dark:text-neutral-100">
            {following.toLocaleString()}
          </span>{" "}
          <span className="text-slate-500 dark:text-neutral-400">following</span>
        </Link>
      </div>

      {/* ── Info rows ────────────────────────────────── */}
      <div className="space-y-2.5 border-t border-slate-200/80 pt-4 dark:border-neutral-800">
        {/* All non-empty social links, rendered as generic link rows */}
        {Object.values(socialLinks)
          .filter(Boolean)
          .map((url) => (
            <a
              key={url}
              href={toHref(url!)}
              target="_blank"
              rel="noreferrer"
              className={infoLinkClass}
            >
              <Link2 className={infoIconClass} />
              <span className="truncate">{displayUrl(url!)}</span>
            </a>
          ))}

        <span className={infoTextClass}>
          <CalendarDays className={infoIconClass} />
          <span>Joined {memberSince}</span>
        </span>

        {/* Placeholder for org — renders NA just like GitHub when no org */}
        <span className={infoTextClass}>
          <Building2 className={infoIconClass} />
          <span className="text-slate-400 dark:text-neutral-500">NA</span>
        </span>
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <div className="space-y-2 border-t border-slate-200/80 pt-4 dark:border-neutral-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
          Stats
        </p>

        <StatRow
          label="Reputation"
          value={stats.reputation.toLocaleString()}
          tone="blue"
        />
        <StatRow
          label="Reports Submitted"
          value={stats.reportsSubmitted.toLocaleString()}
        />
        <StatRow
          label="Accepted"
          value={`${stats.accepted} (${stats.acceptedRate}%)`}
          tone="green"
        />
        {stats.totalEarned > 0 && (
          <StatRow
            label="Total Earned"
            value={`$${stats.totalEarned.toLocaleString()}`}
            tone="green"
          />
        )}
        {stats.globalRank !== undefined && (
          <StatRow label="Global Rank" value={`#${stats.globalRank}`} />
        )}
      </div>
    </motion.aside>
  );
}

function StatRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "blue";
}) {
  const valueClass =
    tone === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "blue"
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-900 dark:text-neutral-100";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-600 dark:text-neutral-400">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
