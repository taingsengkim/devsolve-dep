"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type RoleFilter = "ALL" | "USER" | "COMPANY" | "ADMIN" | "MODERATOR";
export type StatusFilter = "ALL" | "ACTIVE" | "SUSPENDED" | "PENDING";

interface Counts {
  all: number;
  user: number;
  company: number;
  admin: number;
  moderator: number;
}

interface StatusCounts {
  all: number;
  active: number;
  suspended: number;
  pending: number;
}

interface UserFiltersBarProps {
  roleFilter: RoleFilter;
  onRoleFilterChange: (role: RoleFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: Counts;
  statusCounts: StatusCounts;
}

const ROLE_TABS: { key: RoleFilter; label: string; countKey: keyof Counts }[] = [
  { key: "ALL", label: "All Roles", countKey: "all" },
  { key: "USER", label: "Researchers", countKey: "user" },
  { key: "COMPANY", label: "Companies", countKey: "company" },
  { key: "ADMIN", label: "Admins", countKey: "admin" },
  { key: "MODERATOR", label: "Moderators", countKey: "moderator" },
];

const STATUS_TABS: { key: StatusFilter; label: string; countKey: keyof StatusCounts }[] = [
  { key: "ALL", label: "All", countKey: "all" },
  { key: "ACTIVE", label: "Active", countKey: "active" },
  { key: "SUSPENDED", label: "Suspended", countKey: "suspended" },
  { key: "PENDING", label: "Pending", countKey: "pending" },
];

export function UserFiltersBar({
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
  statusCounts,
}: UserFiltersBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
      {/* Top row: role tabs + search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ROLE_TABS.map((tab) => {
            const isActive = roleFilter === tab.key;
            return (
              <Button
                key={tab.key}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onRoleFilterChange(tab.key)}
                className={`rounded-xl text-sm font-semibold h-9 px-3.5 cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-blue-500/40 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {counts[tab.countKey]}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search name or email..."
            className="pl-9 pr-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm focus-visible:ring-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: status sub-filter */}
      <div className="flex items-center gap-1.5 px-4 pb-3 border-t border-slate-100 dark:border-slate-800 pt-3 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 shrink-0">
          Status:
        </span>
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusFilterChange(tab.key)}
              className={`shrink-0 h-7 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
              {tab.key !== "ALL" && (
                <span
                  className={`ml-1.5 ${
                    isActive ? "opacity-70" : "opacity-60"
                  }`}
                >
                  {statusCounts[tab.countKey]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
