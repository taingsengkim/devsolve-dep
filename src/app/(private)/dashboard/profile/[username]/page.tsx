"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileNotFound from "@/components/profile/ProfileNotFound";
import ProfileEditPanel from "@/components/profile/edit/ProfileEditPanel";
import { isNotFoundError } from "@/lib/profile/query-error";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error, refetch } =
    useGetProfileByUsernameQuery(username);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <ProfileNotFound
        identifier={username}
        notFound={isNotFoundError(error)}
        onRetry={refetch}
        scope="dashboard"
      />
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
