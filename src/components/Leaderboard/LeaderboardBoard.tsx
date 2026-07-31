"use client";

import { useMemo, useState } from "react";
import { Researcher, LeaderboardSortMetric } from "@/lib/types/leaderboard/types";
import LeaderboardControls from "./LeaderboardControls";
import SearchBar from "./SearchBar";
import RankingTable from "./RankingTable";

interface LeaderboardBoardProps {
  researchers: Researcher[];
}

export default function LeaderboardBoard({ researchers }: LeaderboardBoardProps) {
  const [sortBy, setSortBy] = useState<LeaderboardSortMetric>("reputation");
  const [query, setQuery] = useState("");

  const visibleResearchers = useMemo(() => {
    const filtered = query.trim()
      ? researchers.filter(
          (r) =>
            r.handle.toLowerCase().includes(query.trim().toLowerCase()) ||
            r.realName.toLowerCase().includes(query.trim().toLowerCase())
        )
      : researchers;

    return [...filtered].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [researchers, query, sortBy]);

  return (
    <div className="mt-10 space-y-5">
      <LeaderboardControls sortBy={sortBy} onSortChange={setSortBy} />
      <SearchBar value={query} onChange={setQuery} />
      <RankingTable researchers={visibleResearchers} sortBy={sortBy} />
    </div>
  );
}
