"use client";

import { AnimatePresence, motion } from "motion/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProgramSort } from "@/hooks/useProgramFilters";
import type { ProgramType } from "@/lib/types/programs/types";
import { cn } from "@/lib/utils";

const PROGRAM_TYPES: ProgramType[] = ["All", "Bounty", "Response"];

const SORT_OPTIONS: Array<{ value: ProgramSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "reward-high", label: "Highest reward" },
  { value: "name", label: "Program name" },
];

export function ProgramTypeTabs({
  selected,
  onSelect,
  sort,
  onSortChange,
  totalCount,
}: {
  selected: ProgramType;
  onSelect: (type: ProgramType) => void;
  sort: ProgramSort;
  onSortChange: (sort: ProgramSort) => void;
  totalCount: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-2 shadow-xs ring-1 ring-foreground/5 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Program type"
        className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1"
      >
        {PROGRAM_TYPES.map((type) => {
          const isActive = selected === type;

          return (
            <button
              key={type}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onSelect(type)}
              className="relative rounded-lg px-3 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-5 sm:text-base"
            >
              {isActive ? (
                <motion.span
                  layoutId="active-program-type"
                  className="absolute inset-0 rounded-lg bg-primary shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {type}
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
              {totalCount.toLocaleString()}
            </span>{" "}
            {totalCount === 1 ? "result" : "results"}
          </motion.p>
        </AnimatePresence>

        <Select
          value={sort}
          onValueChange={(value) =>
            value && onSortChange(value as ProgramSort)
          }
        >
          <SelectTrigger
            aria-label="Sort programs"
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
