"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DiscussionCategory } from "@/lib/types/dicussion/types";

const CATEGORIES: DiscussionCategory[] = ["All", "Problems", "Showcase"];

interface DiscussionCategoryTabsProps {
  selected: DiscussionCategory;
  onSelect: (cat: DiscussionCategory) => void;
  totalCount: number;
}

export function DiscussionCategoryTabs({
  selected,
  onSelect,
  totalCount,
}: DiscussionCategoryTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Pill tab group */}
      <div className="flex items-center gap-1 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`discussion-tab-${cat.toLowerCase()}`}
            onClick={() => onSelect(cat)}
            className="relative rounded-xl px-6 py-2.5 text-base font-bold transition-colors"
          >
            {/* Animated background pill */}
            {selected === cat && (
              <motion.span
                layoutId="active-discussion-category"
                className="absolute inset-0 rounded-xl bg-blue-600 shadow-xs"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                selected === cat ? "text-white" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Results counter */}
      <AnimatePresence mode="wait">
        <motion.p
          key={totalCount}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-base text-slate-700 font-medium"
        >
          <span className="font-extrabold text-blue-600">{totalCount}</span>{" "}
          {totalCount === 1 ? "result" : "results"} found
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
