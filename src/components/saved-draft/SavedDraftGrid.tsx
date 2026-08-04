"use client";

import { motion } from "motion/react";

import { SavedDraftCard } from "@/components/saved-draft/SavedDraftCard";
import type { SavedDraftItem } from "@/components/saved-draft/types";

type SavedDraftGridProps = {
  items: SavedDraftItem[];
  isLoading?: boolean;
  onDelete?: (itemId: string) => void;
};

export function SavedDraftGrid({
  items,
  isLoading = false,
  onDelete,
}: SavedDraftGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, index) => (
          <motion.div
            key={`draft-skeleton-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: index * 0.03, ease: "easeOut" }}
            className="h-full"
          >
            <div className="flex h-full min-h-[258px] animate-pulse flex-col rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between">
                <div className="h-7 w-28 rounded-full bg-slate-100" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-slate-100" />
                  <div className="h-5 w-10 rounded-full bg-amber-100" />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="size-11 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-2/3 rounded bg-slate-100" />
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
              </div>
              <div className="mt-auto border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-28 rounded-full bg-emerald-100" />
                  <div className="h-9 w-28 rounded-xl bg-slate-100" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-7 w-16 rounded-full bg-slate-100" />
                  <div className="h-7 w-20 rounded-full bg-slate-100" />
                  <div className="h-7 w-14 rounded-full bg-slate-100" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
          className="h-full"
        >
          <SavedDraftCard item={item} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
}
