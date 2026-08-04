"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, RotateCcw, DollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramType } from "@/lib/types/programs/types";

interface ProgramFiltersBarProps {
  selectedType: "All" | ProgramType;
  onTypeChange: (type: "All" | ProgramType) => void;
  selectedStatus: string;
  // onStatusChange: (status: string) => void;
  // Reward Range Props
  minReward: string | number;
  maxReward: string | number;
  onMinRewardChange: (val: string) => void;
  onMaxRewardChange: (val: string) => void;
  // Panel Controls
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  isFilterActive: boolean;
  onResetFilters: () => void;
}

export const ProgramFiltersBar: React.FC<ProgramFiltersBarProps> = ({
  selectedType,
  onTypeChange,
  selectedStatus,
  // onStatusChange,
  minReward,
  maxReward,
  onMinRewardChange,
  onMaxRewardChange,
  showMoreFilters,
  onToggleMoreFilters,
  isFilterActive,
  onResetFilters,
}) => {
  const isPointsMode = selectedType === "Response";

  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-4">
          {/* Program Type Filter (All, Bounty, Response) */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {(["All", "Bounty", "Response"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onTypeChange(t)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedType === t
                    ? "bg-blue-600 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Program Status Filter (Moved from More Filters to main bar) */}
          {/* <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            {(["All", "Open", "Done", "Archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedStatus === status
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {status}
              </button>
            ))}
          </div> */}
        </div>

        {/* More Filters Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onToggleMoreFilters}
            className={`h-10 px-4 rounded-xl border-slate-300 text-sm font-semibold cursor-pointer gap-2 ${
              showMoreFilters || minReward !== "" || maxReward !== ""
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </Button>

          {isFilterActive && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onResetFilters}
              title="Reset all filters"
              className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      {/* EXPANDABLE MORE FILTERS PANEL (Only contains Reward Range) */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                {isPointsMode ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-blue-600" /> Points Range (pts)
                  </>
                ) : (
                  <>
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Reward Range ($ USD)
                  </>
                )}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              {/* Min Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-500">
                  Min {isPointsMode ? "Points" : "Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {isPointsMode ? "pts" : "$"}
                  </span>
                  <input
                    type="number"
                    placeholder={isPointsMode ? "e.g. 20" : "e.g. 500"}
                    value={minReward}
                    onChange={(e) => onMinRewardChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Max Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-500">
                  Max {isPointsMode ? "Points" : "Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {isPointsMode ? "pts" : "$"}
                  </span>
                  <input
                    type="number"
                    placeholder={isPointsMode ? "e.g. 100" : "e.g. 50000"}
                    value={maxReward}
                    onChange={(e) => onMaxRewardChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};