"use client";

import { useParams, notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowingList from "@/components/profile/following/FollowingList";
import {
  useGetProfileByUsernameQuery,
  useGetMyFollowsQuery,
} from "@/lib/redux/services/profileApi";

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();
  const { data: overview, isLoading: isLoadingProfile, isError } = useGetProfileByUsernameQuery(username);
  const { data: follows, isLoading: isLoadingFollows } = useGetMyFollowsQuery();

  if (isLoadingProfile || isLoadingFollows) {
    return <div className="p-6 text-sm text-slate-400">Loading...</div>;
  }
  if (isError || !overview || !follows) return notFound();

  return (
    <div>
      {/* <div className="rounded-2xl bg-white shadow-sm">
        <ProfileHeader profile={overview.profile} backHref={`/dashboard/profile/${username}`} />
        <div className="h-5" />
      </div> */}

      <div className="mt-6">
        <FollowingList counts={follows.counts} items={follows.items} />
      </div>
    </div>
  );
}