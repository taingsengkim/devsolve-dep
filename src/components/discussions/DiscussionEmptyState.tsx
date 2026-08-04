"use client";

import React from "react";
import { motion } from "motion/react";
import { MessageSquareDashed } from "lucide-react";

interface DiscussionEmptyStateProps {
  onReset: () => void;
  hasFilters: boolean;
}

export function DiscussionEmptyState({ onReset, hasFilters }: DiscussionEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 bg-white p-12 shadow-xs space-y-4"
    >
      <div className="size-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600">
        <MessageSquareDashed className="size-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-2xl font-extrabold text-slate-900">No discussions found</h3>
        <p className="text-base text-slate-700 max-w-sm leading-relaxed">
          {hasFilters
            ? "Try adjusting your search, category, or tag filters."
            : "Be the first to start a discussion."}
        </p>
      </div>
      {hasFilters && (
        <button
          id="discussions-clear-filters"
          onClick={onReset}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-base font-bold text-white shadow-xs transition-colors"
        >
          Clear all filters
        </button>
      )}
    </motion.div>
  );
}
