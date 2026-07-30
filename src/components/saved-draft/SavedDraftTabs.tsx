"use client";

import { AlertTriangle, CircleDot, Lightbulb, type LucideIcon } from "lucide-react";

import type { DraftCategory } from "@/components/saved-draft/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SavedDraftTabsProps = {
  activeTab: DraftCategory;
  counts: Record<DraftCategory, number>;
  onChange: (category: DraftCategory) => void;
};

type DraftTabConfig = {
  key: DraftCategory;
  label: string;
  icon: LucideIcon;
  activeClassName: string;
  countClassName: string;
};

const TAB_CONFIG: DraftTabConfig[] = [
  {
    key: "problem",
    label: "Problem",
    icon: CircleDot,
    activeClassName: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
    countClassName: "bg-white/20 text-white",
  },
  {
    key: "solution",
    label: "Solution",
    icon: Lightbulb,
    activeClassName:
      "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white",
    countClassName: "bg-white/20 text-white",
  },
  {
    key: "program",
    label: "Program Solve",
    icon: AlertTriangle,
    activeClassName:
      "border-amber-500 bg-amber-500 text-white hover:bg-amber-600 hover:text-white",
    countClassName: "bg-white/20 text-white",
  },
];

export function SavedDraftTabs({
  activeTab,
  counts,
  onChange,
}: SavedDraftTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TAB_CONFIG.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <Button
            key={tab.key}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(tab.key)}
            className={cn(
              "h-9 rounded-full border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900",
              isActive && tab.activeClassName
            )}
          >
            <Icon data-icon="inline-start" className="size-3.5" />
            {tab.label}
            <Badge
              className={cn(
                "rounded-full border-0 bg-slate-100 px-1.5 py-0 text-[11px] font-semibold text-slate-500 shadow-none",
                isActive && tab.countClassName
              )}
            >
              {counts[tab.key]}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
