import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { ChevronUp } from "lucide-react";

interface RankingListProps {
  researchers: Researcher[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function RankingList({ researchers, selectedId, onSelect }: RankingListProps) {
  return (
    <div className="mt-6 flex flex-col gap-2">
      {/* Table Header */}
      <div className="grid grid-cols-[48px_minmax(0,1fr)_100px_80px_80px] gap-4 px-4 py-3 bg-slate-50/80 rounded-xl text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        <div className="text-center">Rank</div>
        <div className="text-left">Researcher</div>
        <div className="text-right flex items-center justify-end gap-1">
          <ChevronUp size={14} className="text-slate-400" />
          Reputation
        </div>
        <div className="text-right">Accepted</div>
        <div className="text-right">Critical</div>
      </div>

      {researchers.map((researcher, idx) => {
        const isSelected = researcher.id === selectedId;

        return (
          <motion.div
            key={researcher.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(researcher.id)}
            className={`group relative grid grid-cols-[48px_minmax(0,1fr)_100px_80px_80px] gap-4 items-center cursor-pointer rounded-xl border p-3 transition-all hover:bg-slate-50 ${
              isSelected
                ? "border-blue-500 bg-blue-50/50 shadow-sm"
                : "border-slate-100 bg-white"
            }`}
          >
            {/* Rank */}
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {researcher.rank}
              </div>
            </div>

            {/* Researcher Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              {researcher.avatarUrl ? (
                <img
                  src={researcher.avatarUrl}
                  alt={researcher.handle}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white ring-2 ring-white">
                  {researcher.avatarInitials}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-900 truncate">{researcher.realName}</span>
                {/* <span className="text-xs text-slate-500">Level {researcher.level}</span> */}
              </div>
            </div>

            {/* Reputation */}
            <div className="text-right text-sm font-bold text-slate-900">
              {researcher.reputation.toLocaleString()}
            </div>

            {/* Accepted */}
            <div className="text-right text-sm font-medium text-slate-600">
              {researcher.accepted}
            </div>

            {/* Critical */}
            <div className="text-right text-sm font-medium text-slate-600">
              {researcher.critical}
            </div>
            
            {/* Selection indicator line */}
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
