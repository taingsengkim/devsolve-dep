"use client";

import { motion } from "motion/react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error } = useGetProfileByUsernameQuery(username);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="w-full aspect-square rounded-2xl bg-slate-200" />
            <div className="h-48 rounded-2xl bg-slate-200" />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="h-40 rounded-2xl bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load profile: {JSON.stringify(error)}
      </div>
    );
  }

  const { profile: rawProfile, stats, severity, badges } = data;

  // The backend only ever returns the signed-in user's own profile — there's no
  // real public-lookup-by-username endpoint yet (see profileApi.ts notes). So
  // "own profile" isn't reliably knowable from the URL alone; this checks whether
  // the route's username actually matches what the backend returned for "me".
  // If they don't match, this is someone else's URL but you're still seeing your
  // own data under it — isOwnProfile is forced false so Settings/edit actions hide.
  const isOwnProfile = profile_matches_route(rawProfile.username, username);
  const profile = { ...rawProfile, isOwnProfile };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Avatar & Stats */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProfileSidebar profile={profile} stats={stats} />
        </div>

        {/* Right Column — Header, bio & tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div>
            <ProfileHeader profile={profile} />
            <div className="px-1 pb-5">
              <ProfileBio profile={profile} />
            </div>
          </div>

          <Suspense fallback={null}>
            <ProfileTabsContainer stats={stats} severity={severity} badges={badges} username={username} />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}

function profile_matches_route(returnedUsername: string, routeUsername: string): boolean {
  return returnedUsername.toLowerCase() === routeUsername.toLowerCase();
}