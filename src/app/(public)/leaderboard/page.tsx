
import LeaderboardClient from '@/components/Leaderboard/LeaderboardClient';
import { mockTopResearchers, mockRankingTable } from '@/lib/types/leaderboard/mock-data';

export default function LeaderboardPage() {
  // Combine all researchers for the mock view, sort by rank to ensure consistency
  const allResearchers = [...mockTopResearchers, ...mockRankingTable].sort((a, b) => a.rank - b.rank);
  
  // Deduplicate just in case mockTopResearchers and mockRankingTable have overlap in ranks
  const uniqueResearchers = Array.from(new Map(allResearchers.map(r => [r.id, r])).values());
  const sortedResearchers = uniqueResearchers.sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen bg-white">
      <LeaderboardClient researchers={sortedResearchers} />
    </div>
  );
}
