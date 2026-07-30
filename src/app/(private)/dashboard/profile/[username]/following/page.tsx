import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowingList from "@/components/profile/following/FollowingList";
import { mockProfile, mockFollowingCounts, mockFollowedHackers } from "@/lib/types/profile/mock-data";

interface FollowingPageProps {
  params: Promise<{ username: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  // TODO: replace with a real fetch keyed by username
  const { username } = await params;
  void username;

  return (
    <div>
      <div className="rounded-2xl bg-white shadow-sm">
        <ProfileHeader profile={mockProfile} backHref={`/dashboard/profile/${mockProfile.username}`} />
        <div className="h-5" />
      </div>

      <div className="mt-6">
        <FollowingList counts={mockFollowingCounts} hackers={mockFollowedHackers} />
      </div>
    </div>
  );
}