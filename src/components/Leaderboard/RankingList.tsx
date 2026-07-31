"use client";

import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { TrendingUp, ShieldAlert, CheckCircle2, Award } from "lucide-react";

interface RankingListProps {
  researchers: Researcher[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function RankingList({ researchers, selectedId, onSelect }: RankingListProps) {
  // Find max reputation for progress bar calculation
  const maxRep = Math.max(...researchers.map((r) => r.reputation), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Table Header */}
      <div className="grid grid-cols-[56px_minmax(0,1.5fr)_130px_90px_90px] gap-4 px-4 py-3 bg-slate-100/70 rounded-xl text-xs font-semibold text-slate-500 uppercase tracking-wider border border-slate-200/50">
        <div className="text-center">Rank</div>
        <div className="text-left">Researcher</div>
        <div className="text-right">Reputation</div>
        <div className="text-right">Accepted</div>
        <div className="text-right">Critical</div>
      </div>

      {/* Table Rows */}
      {researchers.map((researcher, idx) => {
        const isSelected = researcher.id === selectedId;
        const repPercentage = Math.min(
          Math.round((researcher.reputation / maxRep) * 100),
          100
        );

        return (
          <motion.div
            key={researcher.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx, 10) * 0.03 }}
            onClick={() => onSelect(researcher.id)}
            className={`group relative grid grid-cols-[56px_minmax(0,1.5fr)_130px_90px_90px] gap-4 items-center cursor-pointer rounded-xl border p-3.5 transition-all hover:shadow-xs ${
              isSelected
                ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30"
                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            {/* Rank + Trend */}
            <div className="flex flex-col items-center justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {researcher.rank}
              </span>
              <span className="mt-0.5 inline-flex items-center text-[10px] font-semibold text-emerald-600">
                <TrendingUp size={10} className="mr-0.5" />
                +{(researcher.trend?.value ?? 3)}
              </span>
            </div>

            {/* Researcher Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              {researcher.avatarUrl ? (
                <img
                  src={researcher.avatarUrl}
                  alt={researcher.handle}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white ring-2 ring-slate-100">
                  {researcher.avatarInitials}
                </div>
              )}

              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {researcher.realName}
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs font-medium text-slate-500 truncate">
                    @{researcher.handle}
                  </span>
                  {researcher.badges?.[0] && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      <Award size={10} className="text-blue-600" />
                      {researcher.badges[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reputation Progress & Score */}
            <div className="flex flex-col items-end justify-center">
              <span className="text-sm font-bold text-slate-900">
                {researcher.reputation.toLocaleString()}
              </span>
              <div className="mt-1 h-1.5 w-full max-w-[90px] rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${repPercentage}%` }}
                  className="h-full rounded-full bg-blue-600"
                />
              </div>
            </div>

            {/* Accepted Reports */}
            <div className="text-right flex items-center justify-end gap-1 text-sm font-semibold text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{researcher.accepted}</span>
            </div>

            {/* Critical Severity */}
            <div className="text-right flex items-center justify-end gap-1 text-sm font-semibold text-slate-700">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>{researcher.critical}</span>
            </div>

            {/* Active Selection indicator line */}
            {isSelected && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -right-px top-2 bottom-2 w-1 rounded-l-full bg-blue-600"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
