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
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs md:flex-row md:items-center">
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
        className="max-w-full shrink-0 overflow-x-auto rounded-xl border border-border bg-muted p-1"
      >
        {TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <ToggleGroupItem
              key={tab.key}
              value={tab.key}
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-sm font-semibold text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-2xs"
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
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search name, owner, or website..."
          className="h-10 rounded-xl border-border bg-card pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-2xs"
        />
        {searchQuery && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Clear organization search"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};
