"use client";

import { useParams, notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowersList from "@/components/profile/followers/FollowersList";
import {
  useGetProfileByUsernameQuery,
  useGetFollowersQuery,
} from "@/lib/redux/services/profileApi";

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();
  const { data: overview, isLoading: isLoadingProfile, isError } = useGetProfileByUsernameQuery(username);
  const { data: followers, isLoading: isLoadingFollowers } = useGetFollowersQuery(overview?.profile.id ?? "", {
    skip: !overview,
  });

  if (isLoadingProfile || isLoadingFollowers) {
    return <div className="p-6 text-sm text-slate-400">Loading...</div>;
  }
  if (isError || !overview || !followers) return notFound();

  return (
    <div>
      {/* <div className="rounded-2xl bg-white shadow-sm">
        <ProfileHeader profile={overview.profile} backHref={`/dashboard/profile/${username}`} />
        <div className="h-5" />
      </div> */}

      <div className="mt-6">
        <FollowersList total={followers.total} items={followers.items} />
      </div>
    </div>
  );
}
