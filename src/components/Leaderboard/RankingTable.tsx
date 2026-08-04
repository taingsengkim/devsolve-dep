import { Researcher, LeaderboardSortMetric } from "@/lib/types/leaderboard/types";
import RankingRow from "./RankingRow";

interface RankingTableProps {
  researchers: Researcher[];
  sortBy: LeaderboardSortMetric;
}

const COLUMN_LABEL: Record<LeaderboardSortMetric, string> = {
  reputation: "Reputation",
  accepted: "Accepted",
  critical: "Critical",
};

export default function RankingTable({ researchers, sortBy }: RankingTableProps) {
  if (researchers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-base text-slate-400">
        No researchers match your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <div className="grid min-w-[640px] grid-cols-[40px_1fr_110px_90px_70px] gap-4 border-b border-slate-100 bg-slate-50 px-2 py-3 text-sm font-semibold uppercase tracking-wide text-slate-400 sm:px-4">
        <span>Rank</span>
        <span>Researcher</span>
        <span className="text-right">
          {sortBy === "reputation" && "^"}
          {COLUMN_LABEL.reputation}
        </span>
        <span className="text-right">
          {sortBy === "accepted" && "^"}
          {COLUMN_LABEL.accepted}
        </span>
        <span className="text-right">
          {sortBy === "critical" && "^"}
          {COLUMN_LABEL.critical}
        </span>
      </div>

      <div className="min-w-[640px]">
        {researchers.map((researcher) => (
          <RankingRow key={researcher.id} researcher={researcher} />
        ))}
      </div>
    </div>
  );
}