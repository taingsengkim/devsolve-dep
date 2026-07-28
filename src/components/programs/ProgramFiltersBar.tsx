"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramType, AssetCategory } from "@/lib/types/programs/types";

interface ProgramFiltersBarProps {
  selectedType: "All" | ProgramType;
  onTypeChange: (type: "All" | ProgramType) => void;
  selectedCategory: "All" | AssetCategory;
  onCategoryChange: (category: "All" | AssetCategory) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  showMoreFilters: boolean;
  onToggleMoreFilters: () => void;
  isFilterActive: boolean;
  onResetFilters: () => void;
}

export const ProgramFiltersBar: React.FC<ProgramFiltersBarProps> = ({
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  showMoreFilters,
  onToggleMoreFilters,
  isFilterActive,
  onResetFilters,
}) => {
  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-4">
          {/* Program Type Filter Segment */}
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

          {/* Asset Category Filter Segment */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            {(["All", "Web", "API", "Mobile", "Network"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* More Filters Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onToggleMoreFilters}
            className={`h-10 px-4 rounded-xl border-slate-300 text-sm font-semibold cursor-pointer gap-2 ${
              showMoreFilters || selectedStatus !== "All"
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

      {/* EXPANDABLE MORE FILTERS PANEL */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Filter by Program Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {(["All", "Open", "Done", "Archived"] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(status)}
                  className={`rounded-lg text-sm font-medium ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
