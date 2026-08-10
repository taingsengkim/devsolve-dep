"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight, UserX } from "lucide-react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileEditPanel from "@/components/profile/edit/ProfileEditPanel";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGetProfileByUsernameQuery(username);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full pb-12"
      >
        <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-neutral-800">
            <UserX className="size-6" />
          </span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
            Profile unavailable
          </h1>
          <p className="text-base text-slate-500 dark:text-neutral-400">
            We couldn&apos;t load{" "}
            <span className="font-semibold">@{username}</span> right now. The
            profile may not exist, or the connection dropped.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            Back to dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  const { profile: rawProfile, stats, severity, badges } = data;

  const isOwnProfile = profileMatchesRoute(rawProfile.username, username);
  const profile = { ...rawProfile, isOwnProfile };

  /* Edit mode — full-page GitHub-style settings form */
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full space-y-6 pb-16"
      >
        {/* Slim utility bar: breadcrumb left, cancel right */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-neutral-800">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer transition-colors hover:text-slate-900 dark:hover:text-neutral-200"
            >
              @{profile.username}
            </button>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-neutral-700" />
            <span className="text-slate-900 dark:text-neutral-200">
              Edit profile
            </span>
          </nav>

          <p className="text-sm text-slate-400 dark:text-neutral-500">
            Changes are saved section by section.
          </p>
        </div>

        <ProfileEditPanel onDone={() => setIsEditing(false)} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full space-y-6 pb-12"
    >
      {/* Slim utility bar: breadcrumb + share */}
      <ProfileHeader profile={profile} />

      {/* ── GitHub two-column layout ────────────────────────────────────
           Mobile: sidebar stacks above the tabs.
           lg+   : sidebar is a fixed-width sticky column, tabs fill the rest.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Left — sticky sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-64 xl:w-72">
          <ProfileSidebar
            profile={profile}
            stats={stats}
            onEdit={() => setIsEditing(true)}
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
  );
}

function profileMatchesRoute(
  returnedUsername: string,
  routeUsername: string,
): boolean {
  return returnedUsername.toLowerCase() === routeUsername.toLowerCase();
}
