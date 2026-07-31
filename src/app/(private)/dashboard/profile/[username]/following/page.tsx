"use client";

import { useParams, notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowingList from "@/components/profile/following/FollowingList";
import {
  useGetProfileByUsernameQuery,
  useGetFollowingCountsQuery,
  useGetFollowedHackersQuery,
} from "@/lib/redux/services/profileApi";

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();
  const { data: overview, isLoading: isLoadingProfile, isError } = useGetProfileByUsernameQuery(username);
  const { data: counts, isLoading: isLoadingCounts } = useGetFollowingCountsQuery(username);
  const { data: hackers, isLoading: isLoadingHackers } = useGetFollowedHackersQuery(username);

  if (isLoadingProfile || isLoadingCounts || isLoadingHackers) {
    return <div className="p-6 text-sm text-slate-400">Loading...</div>;
  }
  if (isError || !overview || !counts || !hackers) return notFound();

  return (
    <div>
      <div className="rounded-2xl bg-white shadow-sm">
        <ProfileHeader profile={overview.profile} backHref={`/dashboard/profile/${username}`} />
        <div className="h-5" />
      </div>

      <div className="mt-6">
        <FollowingList counts={counts} hackers={hackers} />
      </div>
    </div>
  );
}