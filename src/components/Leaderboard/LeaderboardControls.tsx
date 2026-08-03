import { Trophy } from "lucide-react";
import { LeaderboardSortMetric } from "@/lib/types/leaderboard/types";

interface LeaderboardControlsProps {
  sortBy: LeaderboardSortMetric;
  onSortChange: (metric: LeaderboardSortMetric) => void;
}

const SORT_OPTIONS: { id: LeaderboardSortMetric; label: string }[] = [
  { id: "reputation", label: "Reputation" },
  { id: "accepted", label: "Accepted" },
  { id: "critical", label: "Critical" },
];

export default function LeaderboardControls({ sortBy, onSortChange }: LeaderboardControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900">Global Leaderboard</h2>
        <span className="text-sm text-slate-400">· Updated daily</span>
      </div>

      <div className="flex items-center gap-5">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSortChange(option.id)}
            className={`text-sm font-medium transition ${
              sortBy === option.id ? "text-slate-900 underline decoration-blue-600 decoration-2 underline-offset-4" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
