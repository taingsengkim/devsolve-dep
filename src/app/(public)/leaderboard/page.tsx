
import LeaderboardHero from '@/components/Leaderboard/LeaderboardHero';
import TopResearcherGrid from '@/components/Leaderboard/TopResearcherGrid';
import LeaderboardBoard from '@/components/Leaderboard/LeaderboardBoard';
import { mockLeaderboardStats, mockTopResearchers, mockRankingTable } from '@/lib/types/leaderboard/mock-data';


export default function LeaderboardPage() {
  // TODO: replace with a real fetch, e.g. from a leaderboardApi RTK Query endpoint
  const stats = mockLeaderboardStats;
  const topResearchers = mockTopResearchers;
  const rankingTable = mockRankingTable;

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-7xl px-6 py-12">
        <LeaderboardHero stats={stats} />

        <div className="mt-10">
          <TopResearcherGrid researchers={topResearchers} />
        </div>

        <LeaderboardBoard researchers={rankingTable} />
      </main>
    </div>
  );
}
