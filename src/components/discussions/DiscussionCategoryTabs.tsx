"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DiscussionCategory,
  DiscussionSort,
} from "@/lib/types/dicussion/types";
import { cn } from "@/lib/utils";

const CATEGORIES: DiscussionCategory[] = ["All", "Problems", "Showcase"];

const SORT_OPTIONS: { value: DiscussionSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "top", label: "Most voted" },
  { value: "discussed", label: "Most answered" },
  { value: "viewed", label: "Most viewed" },
];

interface DiscussionCategoryTabsProps {
  selected: DiscussionCategory;
  onSelect: (category: DiscussionCategory) => void;
  sort: DiscussionSort;
  onSortChange: (sort: DiscussionSort) => void;
  totalCount: number;
}

export function DiscussionCategoryTabs({
  selected,
  onSelect,
  sort,
  onSortChange,
  totalCount,
}: DiscussionCategoryTabsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-2 shadow-xs ring-1 ring-foreground/5 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Discussion category"
        className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1"
      >
        {CATEGORIES.map((category) => {
          const isActive = selected === category;

          return (
            <button
              key={category}
              id={`discussion-tab-${category.toLowerCase()}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onSelect(category)}
              className="relative rounded-lg px-3 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-5 sm:text-base"
            >
              {isActive && (
                <motion.span
                  layoutId="active-discussion-category"
                  className="absolute inset-0 rounded-lg bg-primary shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className={cn(
                  "relative transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {category}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 px-1 sm:justify-end">
        <AnimatePresence mode="wait">
          <motion.p
            key={totalCount}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
            className="text-sm font-medium text-muted-foreground"
          >
            <span className="font-bold tabular-nums text-foreground">
              {totalCount}
            </span>{" "}
            {totalCount === 1 ? "result" : "results"}
          </motion.p>
        </AnimatePresence>

        <Select
          value={sort}
          onValueChange={(value) =>
            value && onSortChange(value as DiscussionSort)
          }
        >
          <SelectTrigger
            id="discussions-sort"
            aria-label="Sort discussions"
            className="h-10 min-w-36 rounded-xl bg-muted/60 text-base font-semibold"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            <SelectGroup>
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-base"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
