import { Suspense } from "react";
import { headers } from "next/headers";
import ProfileTabsContainer from "@/components/profile/ProfileTabsContainer";
import { auth } from "@/lib/auth/auth";
import {
  mockProfile,
  mockStats,
  mockSeverity,
  mockBadges,
  mockHacktivity,
  mockCommunityPosts,
  mockThanks,
} from "@/lib/types/profile/mock-data";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// TODO: replace with a real fetch, e.g. `await getProfileByUsername(username)`
// The [username] segment isn't matched against anything yet — until a real
// profile-by-username API exists, this route always renders the signed-in
// user's own profile.
async function getProfileData() {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUser = session?.user;

  // The rest of the profile (stats, badges, activity, ...) is still mocked —
  // only the identity shown in the header reflects the signed-in user.
  const profile = sessionUser?.name
    ? {
        ...mockProfile,
        displayName: sessionUser.name,
        avatarInitials: getInitials(sessionUser.name),
      }
    : mockProfile;

  return {
    profile,
    stats: mockStats,
    severity: mockSeverity,
    badges: mockBadges,
    hacktivity: mockHacktivity,
    communityPosts: mockCommunityPosts,
    thanks: mockThanks,
  };
}

export default async function ProfilePage(_props: ProfilePageProps) {
  const { profile, stats, severity, badges, hacktivity, communityPosts, thanks } = await getProfileData();

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