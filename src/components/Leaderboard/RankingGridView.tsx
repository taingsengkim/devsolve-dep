"use client";

import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { TrendingUp, ShieldAlert, CheckCircle2, Award } from "lucide-react";

interface RankingGridViewProps {
  researchers: Researcher[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function RankingGridView({
  researchers,
  selectedId,
  onSelect,
}: RankingGridViewProps) {
  // Max reputation for progress bar calculation
  const maxRep = Math.max(...researchers.map((r) => r.reputation), 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {researchers.map((researcher, idx) => {
        const isSelected = researcher.id === selectedId;
        const repPercentage = Math.min(
          Math.round((researcher.reputation / maxRep) * 100),
          100
        );

        return (
          <motion.div
            key={researcher.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(idx, 8) * 0.04 }}
            onClick={() => onSelect(researcher.id)}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-5 cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                : "border-slate-200/80 hover:border-slate-300"
            }`}
          >
            {/* Header / Avatar Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {researcher.avatarUrl ? (
                    <img
                      src={researcher.avatarUrl}
                      alt={researcher.handle}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-xs">
                      {researcher.avatarInitials}
                    </div>
                  )}

                  {/* Rank Badge */}
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs border border-white">
                    #{researcher.rank}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {researcher.realName}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 truncate">
                    @{researcher.handle}
                  </p>
                </div>
              </div>

              {/* Trend Tag */}
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <TrendingUp size={12} />
                <span>+{(researcher.trend?.value ?? 5)}</span>
              </div>
            </div>

            {/* Reputation Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600">Reputation</span>
                <span className="font-bold text-slate-900">
                  {researcher.reputation.toLocaleString()} pts
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${repPercentage}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.03 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>{researcher.accepted} Accepted</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <ShieldAlert size={14} className="text-amber-500" />
                <span>{researcher.critical} Critical</span>
              </div>
            </div>

            {/* Badges Row */}
            {researcher.badges && researcher.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {researcher.badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"
                  >
                    <Award size={10} className="text-blue-600" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
