"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ProgramsCounts } from "@/lib/types/programs/types";

interface ProgramQuickStatsProps {
  counts: ProgramsCounts;
  quickFilter: "all" | "bounty" | "response" | "new" | "private";
  onQuickFilterClick: (filter: "all" | "bounty" | "response" | "new" | "private") => void;
}

export const ProgramQuickStats: React.FC<ProgramQuickStatsProps> = ({
  counts,
  quickFilter,
  onQuickFilterClick,
}) => {
  return (
    <section className="flex flex-wrap items-center gap-2.5">
      <Button
        variant={quickFilter === "all" ? "default" : "outline"}
        onClick={() => onQuickFilterClick("all")}
        className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
          quickFilter === "all"
            ? "bg-slate-900 text-white shadow-xs"
            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
        }`}
      >
        {counts.all} All Programs
      </Button>

      <Button
        variant={quickFilter === "bounty" ? "default" : "outline"}
        onClick={() => onQuickFilterClick("bounty")}
        className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
          quickFilter === "bounty"
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
      >
        {counts.bounty} Bounty
      </Button>

      <Button
        variant={quickFilter === "response" ? "default" : "outline"}
        onClick={() => onQuickFilterClick("response")}
        className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
          quickFilter === "response"
            ? "bg-indigo-600 text-white shadow-xs"
            : "bg-white border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
        }`}
      >
        {counts.response} Response
      </Button>

      <Button
        variant={quickFilter === "new" ? "default" : "outline"}
        onClick={() => onQuickFilterClick("new")}
        className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
          quickFilter === "new"
            ? "bg-amber-600 text-white shadow-xs"
            : "bg-white border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-700"
        }`}
      >
        {counts.newCount} New
      </Button>

      <Button
        variant={quickFilter === "private" ? "default" : "outline"}
        onClick={() => onQuickFilterClick("private")}
        className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
          quickFilter === "private"
            ? "bg-slate-700 text-white shadow-xs"
            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
        }`}
      >
        {counts.privateCount} Private
      </Button>
    </section>
  );
};
