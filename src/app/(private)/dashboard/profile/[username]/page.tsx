"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight, UserX } from "lucide-react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileEditPanel from "@/components/profile/edit/ProfileEditPanel";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGetProfileByUsernameQuery(username);
  // Editing happens in place — the URL stays on the profile being edited.
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

  // The backend only ever returns the signed-in user's own profile — there's no
  // real public-lookup-by-username endpoint yet (see profileApi.ts notes). So
  // "own profile" isn't reliably knowable from the URL alone; this checks whether
  // the route's username actually matches what the backend returned for "me".
  // If they don't match, this is someone else's URL but you're still seeing your
  // own data under it — isOwnProfile is forced false so Settings/edit actions hide.
  const isOwnProfile = profileMatchesRoute(rawProfile.username, username);
  const profile = { ...rawProfile, isOwnProfile };

  /* Editing is a focused mode at the same URL: the stats column and the
     activity tabs are noise while you're filling in a form, and the sidebar
     avatar would sit next to a second copy of itself. */
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full space-y-6 pb-12"
      >
        <header className="border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              @{profile.username}
            </button>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-slate-200">Edit</span>
          </nav>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Edit profile
          </h1>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Changes show on your public profile as soon as you save.
          </p>
        </header>

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
      <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left — avatar & stats */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProfileSidebar profile={profile} stats={stats} />
        </div>

        {/* Right — details & tabs */}
        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          <ProfileBio profile={profile} />

          <Suspense fallback={null}>
            <ProfileTabsContainer
              stats={stats}
              severity={severity}
              badges={badges}
              username={username}
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
