"use client";

import { useState } from "react";
import { Researcher } from "@/lib/types/leaderboard/types";
import TopThreePodium from "./TopThreePodium";
import RankingList from "./RankingList";
import ResearcherProfile from "./ResearcherProfile";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardClientProps {
  researchers: Researcher[];
}

export default function LeaderboardClient({ researchers }: LeaderboardClientProps) {
  const [selectedId, setSelectedId] = useState<string>(researchers[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFrame, setTimeFrame] = useState<"month" | "all">("month");

  const selectedResearcher = researchers.find((r) => r.id === selectedId) || researchers[0];
  
  // Combine all top researchers and table into one list, or just use what's provided
  // Here we assume `researchers` prop is the full list.
  
  // Filter for the list
  const filteredResearchers = researchers.filter((r) =>
    r.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.realName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leaderboard</h1>
          {/* <p className="mt-1 text-sm text-slate-500 font-medium">All representatives &gt; Compare</p> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setTimeFrame("month")}
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
              onClick={() => setTimeFrame("all")}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-8">
        {/* Left Column */}
        <div className="flex flex-col">
          <TopThreePodium topThree={researchers.slice(0, 3)} />
          
          <div className="mt-8">
            <RankingList 
              researchers={filteredResearchers} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="h-full rounded-2xl bg-slate-50 p-6 border border-slate-100">
          <ResearcherProfile researcher={selectedResearcher} />
        </div>
      </div>
    </div>
  );
}
