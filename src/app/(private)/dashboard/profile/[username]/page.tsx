"use client";

import { useGetProfileByUsernameQuery } from "@/lib/redux/services/profileApi";
import { useParams } from "next/navigation";
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
    <Suspense fallback={null}>
      <ProfileTabsContainer
        profile={profile}
        stats={stats}
        severity={severity}
        badges={badges}
        hacktivity={hacktivity}
        communityPosts={communityPosts}
        thanks={thanks}
      />
    </Suspense>
  );
}