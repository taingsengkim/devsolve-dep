"use client";

import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import { useParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError, error } = useGetProfileByUsernameQuery(username);

  if (isLoading) return <div className="p-6 text-sm text-slate-400">Loading profile...</div>;
  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load profile: {JSON.stringify(error)}
      </div>
    );
  }

  const { profile, stats, severity, badges } = data;

  return (
    <div>
      <div className="rounded-2xl bg-white shadow-sm">
        <ProfileHeader profile={profile} />
        <div className="px-1 pb-5">
          <ProfileBio profile={profile} />
        </div>
      </div>

      <ProfileTabsContainer stats={stats} severity={severity} badges={badges} username={username} />
    </div>
  );
}