"use client";

import { useState, useMemo } from "react";
import { useGetLeaderboardQuery } from "@/lib/redux/services/leaderboardApi";
import LeaderboardHero from "./LeaderboardHero";
import TopThreePodium from "./TopThreePodium";
import RankingList from "./RankingList";
import RankingGridView from "./RankingGridView";
import ResearcherProfile from "./ResearcherProfile";
import { Search, LayoutGrid, List, Sparkles, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeaderboardClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFrame, setTimeFrame] = useState<"month" | "all">("month");
  const [categoryFilter, setCategoryFilter] = useState("Overall");
  const [selectedBadge, setSelectedBadge] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGetLeaderboardQuery({
    search: searchQuery,
    timeFrame,
    category: categoryFilter,
  });

  const allResearchers = data?.researchers ?? [];
  const stats = data?.stats;
  const topThree = data?.topThree ?? allResearchers.slice(0, 3);

  // Apply quick badge filter client-side
  const filteredResearchers = useMemo(() => {
    if (selectedBadge === "All") return allResearchers;
    return allResearchers.filter((r) =>
      r.badges?.includes(selectedBadge as any)
    );
  }, [allResearchers, selectedBadge]);

  const currentSelectedId = selectedId || filteredResearchers[0]?.id || allResearchers[0]?.id || "";
  const selectedResearcher =
    allResearchers.find((r) => r.id === currentSelectedId) || allResearchers[0];

  const badgeChips = ["All", "Top 10", "Bug Slayer", "Speed Hacker", "First Blood", "Retest Pro"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      {/* 1. Hero Banner with Live Platform Metrics */}
      {/* <LeaderboardHero stats={stats} /> */}

      {/* 2. Top 3 Podium Showcase */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* <Sparkles size={18} className="text-amber-500" /> */}
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Top Performers Showcase
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live Rankings
          </span>
        </div>
        <TopThreePodium topThree={topThree} onSelect={setSelectedId} />
      </div>

      {/* 3. Controls & Filter Toolbar */}
      <div className="mb-8 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by researcher name or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex h-10 rounded-xl border border-slate-300 bg-slate-100/80 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List size={15} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid size={15} />
                <span>Grid</span>
              </button>
            </div>

            {/* Category Select */}
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val ?? "Overall")}
            >
              <SelectTrigger className="h-10 w-36 border-slate-300 bg-white text-sm font-medium text-slate-700 focus:ring-1 focus:ring-blue-600 focus:ring-offset-0 shadow-xs">
                <SelectValue placeholder="Overall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Overall">Overall</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Timeframe Toggle */}
            <div className="flex h-10 rounded-xl border border-slate-300 bg-slate-100/80 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setTimeFrame("month")}
                className={`rounded-lg px-3 text-xs font-bold transition-all ${
                  timeFrame === "month"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame("all")}
                className={`rounded-lg px-3 text-xs font-bold transition-all ${
                  timeFrame === "all"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Quick Badge Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filter Badges:</span>
          {badgeChips.map((chip) => {
            const isActive = selectedBadge === chip;
            return (
              <button
                type="button"
                key={chip}
                onClick={() => setSelectedBadge(chip)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {chip !== "All" && <Award size={12} />}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Section: Rankings List / Grid + Profile Inspector */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left Column (Table or Grid) */}
          <div>
            {filteredResearchers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-sm font-medium text-slate-500">
                No researchers match your selected filters.
              </div>
            ) : viewMode === "table" ? (
              <RankingList
                researchers={filteredResearchers}
                selectedId={currentSelectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <RankingGridView
                researchers={filteredResearchers}
                selectedId={currentSelectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Right Column (Sticky Researcher Profile Spotlight) */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs sticky top-8">
            <ResearcherProfile researcher={selectedResearcher} />
          </div>
        </div>
      )}
    </div>
  );
}
