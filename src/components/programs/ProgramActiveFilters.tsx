"use client";

import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export function ProgramActiveFilters({
  searchTerm,
  type,
  asset,
  severity,
  industry,
  country,
  minReward,
  maxReward,
  sort,
  onClearSearch,
  onClearType,
  onClearAsset,
  onClearSeverity,
  onClearIndustry,
  onClearCountry,
  onClearReward,
  onClearSort,
  onResetAll,
}: {
  searchTerm: string;
  type: string;
  asset: string;
  severity: string;
  industry: string;
  country: string;
  minReward: string;
  maxReward: string;
  sort: string;
  onClearSearch: () => void;
  onClearType: () => void;
  onClearAsset: () => void;
  onClearSeverity: () => void;
  onClearIndustry: () => void;
  onClearCountry: () => void;
  onClearReward: () => void;
  onClearSort: () => void;
  onResetAll: () => void;
}) {
  const chips: FilterChip[] = [];

  if (searchTerm.trim()) {
    chips.push({
      key: "search",
      label: "Search",
      value: `“${searchTerm.trim()}”`,
      onRemove: onClearSearch,
    });
  }
  if (type !== "All") {
    chips.push({ key: "type", label: "Type", value: type, onRemove: onClearType });
  }
  if (asset !== "All") {
    chips.push({ key: "asset", label: "Asset", value: asset, onRemove: onClearAsset });
  }
  if (severity !== "All") {
    chips.push({
      key: "severity",
      label: "Severity",
      value: severity,
      onRemove: onClearSeverity,
    });
  }
  if (industry !== "All") {
    chips.push({
      key: "industry",
      label: "Industry",
      value: industry,
      onRemove: onClearIndustry,
    });
  }
  if (country.trim()) {
    chips.push({
      key: "country",
      label: "Country",
      value: country.trim(),
      onRemove: onClearCountry,
    });
  }
  if (minReward || maxReward) {
    chips.push({
      key: "reward",
      label: "Reward",
      value: `${minReward || "0"} – ${maxReward || "Any"}`,
      onRemove: onClearReward,
    });
  }
  if (sort !== "newest") {
    chips.push({
      key: "sort",
      label: "Sort",
      value: sort === "reward-high" ? "Highest reward" : "Program name",
      onRemove: onClearSort,
    });
  }

  return (
    <AnimatePresence initial={false}>
      {chips.length > 0 ? (
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
      ) : null}
    </AnimatePresence>
  );
}
