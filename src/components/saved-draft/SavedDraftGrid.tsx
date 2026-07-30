"use client";

import { motion } from "motion/react";

import { SavedDraftCard } from "@/components/saved-draft/SavedDraftCard";
import type { SavedDraftItem } from "@/components/saved-draft/types";

type SavedDraftGridProps = {
  items: SavedDraftItem[];
};

export function SavedDraftGrid({ items }: SavedDraftGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
        >
          <SavedDraftCard item={item} />
        </motion.div>
      ))}
    </div>
  );
}
