"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  DiscussionCategory,
  TopicFilter,
} from "@/lib/types/dicussion/types";

interface DiscussionActiveFiltersProps {
  category: DiscussionCategory;
  topic: TopicFilter | null;
  tag: string | null;
  searchQuery: string;
  onClearCategory: () => void;
  onClearTopic: () => void;
  onClearTag: () => void;
  onClearSearch: () => void;
  onResetAll: () => void;
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export function DiscussionActiveFilters({
  category,
  topic,
  tag,
  searchQuery,
  onClearCategory,
  onClearTopic,
  onClearTag,
  onClearSearch,
  onResetAll,
}: DiscussionActiveFiltersProps) {
  const chips: FilterChip[] = [];

  if (category !== "All") {
    chips.push({
      key: "category",
      label: "Category",
      value: category,
      onRemove: onClearCategory,
    });
  }
  if (topic) {
    chips.push({ key: "topic", label: "Topic", value: topic, onRemove: onClearTopic });
  }
  if (tag) {
    chips.push({ key: "tag", label: "Tag", value: tag, onRemove: onClearTag });
  }
  if (searchQuery) {
    chips.push({
      key: "search",
      label: "Search",
      value: `“${searchQuery}”`,
      onRemove: onClearSearch,
    });
  }

  return (
    <AnimatePresence initial={false}>
      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Active filters
            </span>

            <AnimatePresence initial={false} mode="popLayout">
              {chips.map((chip) => (
                <motion.div
                  key={chip.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={chip.onRemove}
                    aria-label={`Remove ${chip.label.toLowerCase()} filter ${chip.value}`}
                    className="max-w-64 rounded-lg"
                  >
                    <span className="truncate">
                      <span className="font-medium text-muted-foreground">
                        {chip.label}:
                      </span>{" "}
                      {chip.value}
                    </span>
                    <X data-icon="inline-end" aria-hidden="true" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onResetAll}
              className="ml-auto rounded-lg"
            >
              Clear all
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
