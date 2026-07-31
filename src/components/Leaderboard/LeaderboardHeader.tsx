import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  timeFrame: "month" | "all";
  onTimeFrameChange: (val: "month" | "all") => void;
}

export default function LeaderboardHeader({
  searchQuery,
  onSearchChange,
  timeFrame,
  onTimeFrameChange,
}: LeaderboardHeaderProps) {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leaderboard</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full sm:w-64 rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <Select defaultValue="Overall">
          <SelectTrigger className="h-10 w-32 border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0">
            <SelectValue placeholder="Overall" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Overall">Overall</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex h-10 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => onTimeFrameChange("month")}
            className={`rounded-md px-4 text-xs font-bold transition-colors ${
              timeFrame === "month"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => onTimeFrameChange("all")}
            className={`rounded-md px-4 text-xs font-bold transition-colors ${
              timeFrame === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            All Time
          </button>
        </div>
      </div>
    </div>
  );
}
