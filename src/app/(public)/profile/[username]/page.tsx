"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { UserX } from "lucide-react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGetProfileByUsernameQuery(username);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full pb-12"
        >
          <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <UserX className="size-6" />
            </span>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Profile unavailable
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              We couldn&apos;t load{" "}
              <span className="font-semibold">@{username}</span> right now. The
              profile may not exist, or the connection dropped.
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              View Leaderboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const { profile: rawProfile, stats, severity, badges } = data;
  const profile = { ...rawProfile, isOwnProfile: false };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full space-y-6 pb-12"
      >
        {/* Top utility bar: breadcrumb + share */}
        <ProfileHeader profile={profile} isPublicView />

        {/* ── GitHub two-column layout ────────────────────────────────────
             Mobile: sidebar stacks above the tabs.
             lg+   : sidebar is a fixed-width sticky column, tabs fill the rest.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left — sticky sidebar */}
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-64 xl:w-72">
            <ProfileSidebar
              profile={profile}
              stats={stats}
              baseProfilePath={`/profile/${username}`}
            />
          </div>

          {/* Right — tabs + content */}
          <div className="min-w-0 flex-1">
            <Suspense fallback={null}>
              <ProfileTabsContainer
                stats={stats}
                severity={severity}
                badges={badges}
                username={username}
                userId={profile.id}
              />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
