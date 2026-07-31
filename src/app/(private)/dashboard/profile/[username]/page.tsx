"use client";

import { motion } from "motion/react";
import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
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

  const { profile, stats, severity, badges } = data;

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

        {/* Right Column — Header, Bio & Tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl bg-white shadow-sm">
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