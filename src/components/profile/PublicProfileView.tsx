"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileNotFound from "@/components/profile/ProfileNotFound";
import { isNotFoundError } from "@/lib/api/query-error";

/**
 * A member's public profile.
 *
 * Lifted out of `app/(public)/profile/[username]/page.tsx` so that route can be
 * a server component and describe itself to crawlers — `generateMetadata` is
 * not available in a module marked "use client". The id still comes from
 * `useParams` rather than a prop, so nothing about the rendering changed.
 */
export default function PublicProfileView() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error, refetch } =
    useGetProfileByUsernameQuery(username);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <ProfileNotFound
        identifier={username}
        notFound={isNotFoundError(error)}
        onRetry={refetch}
      />
    );
  }

  const { profile: rawProfile, stats, severity, badges } = data;
  const profile = { ...rawProfile, isOwnProfile: false };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start">
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
