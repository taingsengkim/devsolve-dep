"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { UserCheck, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useKeycloakLogin } from "@/hooks/useKeycloakLogin";
import { FollowRecord } from "@/lib/types/profile/types";
import {
  useFollowTargetMutation,
  useUnfollowTargetMutation,
} from "@/lib/redux/services/profileApi";

interface FollowerItemProps {
  record: FollowRecord;
  baseProfilePath?: string;
}

function formatFollowedSince(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function FollowerItem({ record, baseProfilePath = "/dashboard/profile" }: FollowerItemProps) {
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { isLoggingIn, handleLogin } = useKeycloakLogin();
  const [isFollowing, setIsFollowing] = useState(record.isFollowing ?? false);
  const [followTarget, { isLoading: isFollowingLoading }] = useFollowTargetMutation();
  const [unfollowTarget, { isLoading: isUnfollowingLoading }] = useUnfollowTargetMutation();

  const isPending =
    isSessionPending || isLoggingIn || isFollowingLoading || isUnfollowingLoading;
  const targetId = record.followableId || record.id;
  const targetType = record.followableType || "USER";

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
        await unfollowTarget({ type: targetType, targetId }).unwrap();
        toast.success("Unfollowed successfully");
      } else {
        await followTarget({ type: targetType, targetId }).unwrap();
        toast.success("Following back");
      }
    } catch (err: unknown) {
      setIsFollowing(previousState);
      const message = (err as { data?: { message?: string } })?.data?.message ?? "Failed to update follow status";
      toast.error(message);
    }
  };

  const displayName = record.displayName ?? (record.username ? record.username : `Follower #${record.id.slice(0, 8)}`);
  const handle = record.username ? `@${record.username}` : `#${record.id.slice(0, 8)}`;
  const initials = record.avatarInitials ?? displayName.slice(0, 2).toUpperCase();
  const profileUrl = record.username ? `${baseProfilePath}/${record.username}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
    >
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        {/* Avatar */}
        <Link href={profileUrl} className="relative shrink-0 group">
          {record.avatarUrl ? (
            <img
              src={record.avatarUrl}
              alt={displayName}
              className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white text-sm shadow-2xs group-hover:opacity-95 transition-opacity">
              {initials}
            </div>
          )}
        </Link>

        {/* User Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={profileUrl}
              className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {displayName}
            </Link>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {handle}
            </span>
            {record.reputation !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
                <ShieldCheck size={12} />
                {record.reputation.toLocaleString()} rep
              </span>
            )}
          </div>

          {record.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {record.bio}
            </p>
          )}

          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Followed since {formatFollowedSince(record.createdAt)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          disabled={isPending}
          onClick={handleToggleFollow}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-70 ${
            isFollowing
              ? "border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
          }`}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isFollowing ? (
            <>
              <UserCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={14} />
              <span>Follow back</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
