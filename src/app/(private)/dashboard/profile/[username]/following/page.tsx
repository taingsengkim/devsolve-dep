"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "motion/react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowingList from "@/components/profile/following/FollowingList";
import {
  useGetProfileByUsernameQuery,
  useGetMyFollowsQuery,
  useGetUserFollowingQuery,
} from "@/lib/redux/services/profileApi";

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();
  const { data: overview, isLoading: isLoadingProfile, isError } = useGetProfileByUsernameQuery(username);

  const isOwnProfile = overview?.profile.isOwnProfile ?? false;
  const userId = overview?.profile.id ?? "";

  const { data: myFollows, isLoading: isLoadingMyFollows } = useGetMyFollowsQuery(undefined, {
    skip: !overview || !isOwnProfile,
  });

  const { data: userFollows, isLoading: isLoadingUserFollows } = useGetUserFollowingQuery(userId, {
    skip: !overview || isOwnProfile || !userId,
  });

  const isLoadingFollows = isOwnProfile ? isLoadingMyFollows : isLoadingUserFollows;
  const follows = isOwnProfile ? myFollows : userFollows;

  if (isLoadingProfile || isLoadingFollows) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }
  if (isError || !overview || !follows) return notFound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs">
        <ProfileHeader profile={overview.profile} backHref={`/dashboard/profile/${username}`} />
      </div>

      <div>
        <FollowingList counts={follows.counts} items={follows.items} />
      </div>
    </motion.div>
  );
}