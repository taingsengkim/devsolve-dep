"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { OrganizationVerificationFilter } from "@/lib/types/admin/types";

interface OrganizationFiltersBarProps {
  statusFilter: OrganizationVerificationFilter;
  onStatusFilterChange: (status: OrganizationVerificationFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const TABS: {
  key: OrganizationVerificationFilter;
  label: string;
  countKey: keyof OrganizationFiltersBarProps["counts"];
}[] = [
  { key: "ALL", label: "All", countKey: "all" },
  { key: "PENDING", label: "Pending KYC", countKey: "pending" },
  { key: "APPROVED", label: "Approved", countKey: "approved" },
  { key: "REJECTED", label: "Rejected", countKey: "rejected" },
];

export const OrganizationFiltersBar: React.FC<OrganizationFiltersBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
      {/* STATUS FILTER TABS */}
      <ToggleGroup
        multiple={false}
        value={[statusFilter]}
        onValueChange={(values) => {
          const nextStatus = values[values.length - 1] as
            | OrganizationVerificationFilter
            | undefined;
          if (nextStatus) onStatusFilterChange(nextStatus);
        }}
        spacing={1}
        className="max-w-full shrink-0 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80"
      >
        {TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <ToggleGroupItem
              key={tab.key}
              value={tab.key}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-sm font-semibold text-slate-600 data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-2xs dark:text-slate-400 dark:data-[state=on]:bg-slate-900 dark:data-[state=on]:text-slate-100"
            >
              {tab.label}
              <Badge variant={isActive ? "default" : "secondary"} className="rounded-full tabular-nums">
                {counts[tab.countKey]}
              </Badge>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {/* SEARCH INPUT BAR */}
      <div className="relative w-full md:w-80 shrink-0">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search name, owner, or website..."
          className="h-10 rounded-xl border-slate-300 bg-white pl-9 pr-10 text-sm shadow-2xs dark:border-slate-700 dark:bg-slate-950"
        />
        {searchQuery && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Clear organization search"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};
