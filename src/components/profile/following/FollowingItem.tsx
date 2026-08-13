"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useKeycloakLogin } from "@/hooks/useKeycloakLogin";
import { FollowingUser } from "@/lib/types/profile/types";
import {
  useFollowTargetMutation,
  useUnfollowTargetMutation,
} from "@/lib/redux/services/profileApi";
import ResearcherAvatar from "@/components/Leaderboard/ResearcherAvatar";

interface FollowingItemProps {
  user: FollowingUser;
  baseProfilePath?: string;
  onUnfollow?: (userId: string) => void;
}

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DU"
  );
}

function formatFollowerCount(count: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: count >= 1000 ? 1 : 0,
  }).format(count);
}

function shortBiography(text: string, maxLength = 72) {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const preview = lastSpace > Math.floor(maxLength * 0.6)
    ? truncated.slice(0, lastSpace)
    : text.slice(0, maxLength);

  return `${preview.trimEnd()}...`;
}

export default function FollowingItem({
  user,
  baseProfilePath = "/dashboard/profile",
  onUnfollow,
}: FollowingItemProps) {
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { isLoggingIn, handleLogin } = useKeycloakLogin();
  const [isFollowing, setIsFollowing] = useState(user.following);
  const [followTarget, { isLoading: isFollowingLoading }] = useFollowTargetMutation();
  const [unfollowTarget, { isLoading: isUnfollowingLoading }] = useUnfollowTargetMutation();

  const isPending =
    isSessionPending || isLoggingIn || isFollowingLoading || isUnfollowingLoading;
  const targetId = user.userId;
  const displayName = user.fullName;
  const biography = user.biography?.trim() || null;
  const biographyPreview = biography ? shortBiography(biography) : null;
  const followerCount = user.followerCount;
  const profileUrl = `${baseProfilePath}/${user.userId}`;
  const initials = initialsOf(displayName);

  const handleToggleFollow = async () => {
    if (isPending) return;
    if (!session) {
      const redirectTo =
        typeof window === "undefined"
          ? pathname
          : `${window.location.pathname}${window.location.search}${window.location.hash}`;
      await handleLogin(redirectTo);
      return;
    }

    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      if (previousState) {
        await unfollowTarget({ type: "USER", targetId }).unwrap();
        toast.success("Unfollowed successfully");
        onUnfollow?.(user.userId);
      } else {
        await followTarget({ type: "USER", targetId }).unwrap();
        toast.success("Following");
      }
    } catch (err: unknown) {
      setIsFollowing(previousState);
      const message = (err as { data?: { message?: string } })?.data?.message ?? "Failed to update follow status";
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
    >
      <Link href={profileUrl} className="relative shrink-0 group">
        <ResearcherAvatar
          username={user.userId}
          displayName={displayName}
          avatarUrl={user.avatarUrl ?? undefined}
          initials={initials}
          size={48}
          className="rounded-2xl ring-slate-200 transition-transform group-hover:scale-105 dark:ring-slate-800"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              href={profileUrl}
              className="block truncate text-base font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
            >
              {displayName}
            </Link>

            {biographyPreview && (
              <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                {biographyPreview}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
            {followerCount > 0 && (
              <p className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                {formatFollowerCount(followerCount)}{" "}
                {followerCount === 1 ? "follower" : "followers"}
              </p>
            )}

            <button
              type="button"
              disabled={isPending}
              onClick={handleToggleFollow}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-70 ${
                isFollowing
                  ? "border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
              }`}
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserCheck
                    size={14}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
