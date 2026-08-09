"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetModerationHistoryQuery,
} from "@/lib/redux/services/admin/moderationActionsApi";
import {
  ModerationActionResponse,
  ModerationActionTargetType,
  ModerationActionType,
} from "@/lib/types/admin/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ModerationActionDetailModal } from "./ModerationActionDetailModal";
import {
  Search,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  User,
} from "lucide-react";

export function ModerationHistoryTable() {
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [targetIdSearch, setTargetIdSearch] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const { data: response, isLoading, isFetching } = useGetModerationHistoryQuery({
    targetType:
      targetTypeFilter !== "ALL"
        ? (targetTypeFilter as ModerationActionTargetType)
        : undefined,
    action:
      actionFilter !== "ALL"
        ? (actionFilter as ModerationActionType)
        : undefined,
    targetId: targetIdSearch.trim() || undefined,
    pageNumber,
    pageSize,
  });

  const actionsList: ModerationActionResponse[] = response?.content ?? [];
  const totalElements = response?.totalElements ?? 0;
  const totalPages = response?.totalPages ?? 1;

  const resetFilters = () => {
    setTargetTypeFilter("ALL");
    setActionFilter("ALL");
    setTargetIdSearch("");
    setPageNumber(0);
  };

  const getActionBadge = (action: ModerationActionType) => {
    switch (action) {
      case "WARN":
        return <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">WARN</Badge>;
      case "SUSPEND":
      case "REMOVE":
      case "BAN":
        return <Badge variant="destructive">{action}</Badge>;
      case "REINSTATE":
        return <Badge variant="secondary">REINSTATE</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* FILTER TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Target ID Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              value={targetIdSearch}
              onChange={(e) => {
                setTargetIdSearch(e.target.value);
                setPageNumber(0);
              }}
              placeholder="Search by Target ID..."
              className="h-9 pl-9 pr-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
          </div>

          {/* Target Type Select Filter */}
          <div className="w-44">
            <Select
              value={targetTypeFilter}
              onValueChange={(val: string | null) => {
                if (val) {
                  setTargetTypeFilter(val);
                  setPageNumber(0);
                }
              }}
            >
              <SelectTrigger className="h-9 rounded-xl border-slate-300 bg-white text-sm font-semibold dark:border-slate-700 dark:bg-slate-950">
                <SelectValue placeholder="Target Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">All Target Types</SelectItem>
                  <SelectItem value="PROGRAM">Program</SelectItem>
                  <SelectItem value="PROBLEM">Problem</SelectItem>
                  <SelectItem value="SOLUTION">Solution</SelectItem>
                  <SelectItem value="COMMENT">Comment</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="REPORT">Report</SelectItem>
                  <SelectItem value="SHOWCASE">Showcase</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Action Select Filter */}
          <div className="w-36">
            <Select
              value={actionFilter}
              onValueChange={(val: string | null) => {
                if (val) {
                  setActionFilter(val);
                  setPageNumber(0);
                }
              }}
            >
              <SelectTrigger className="h-9 rounded-xl border-slate-300 bg-white text-sm font-semibold dark:border-slate-700 dark:bg-slate-950">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">All Actions</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="SUSPEND">SUSPEND</SelectItem>
                  <SelectItem value="REMOVE">REMOVE</SelectItem>
                  <SelectItem value="BAN">BAN</SelectItem>
                  <SelectItem value="REINSTATE">REINSTATE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {(targetTypeFilter !== "ALL" || actionFilter !== "ALL" || targetIdSearch.trim() !== "") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 cursor-pointer rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <RotateCcw data-icon="inline-start" /> Reset
            </Button>
          )}
        </div>

        {/* Total Badge */}
        <div className="text-xs text-slate-500 font-semibold self-end lg:self-center">
          Total Recorded Actions: <span className="text-slate-900 dark:text-slate-100 font-bold">{totalElements}</span>
        </div>
      </div>

      {/* DATA TABLE */}
      {isLoading || isFetching ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
        </div>
      ) : actionsList.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
          <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <ShieldCheck className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No Moderation Actions Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No historical moderation actions matched your applied search or filter criteria.
            </p>
          </div>
          {(targetTypeFilter !== "ALL" || actionFilter !== "ALL" || targetIdSearch.trim() !== "") && (
            <Button
              onClick={resetFilters}
              variant="outline"
              className="rounded-xl font-semibold border-slate-300 dark:border-slate-700 cursor-pointer h-9 text-xs"
            >
              <RotateCcw className="size-3.5 mr-1.5" /> Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Type</th>
                  <th className="py-3.5 px-4">Target ID</th>
                  <th className="py-3.5 px-4">Admin Name</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-sm">
                <AnimatePresence mode="popLayout">
                  {actionsList.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">{getActionBadge(item.action)}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {item.targetType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
                        {item.targetId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="size-3.5 text-slate-400" />
                          <span>{item.adminName || item.adminId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[220px] truncate">
                        {item.reason}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 text-slate-400" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedActionId(item.id)}
                          className="h-8 cursor-pointer rounded-xl px-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                          <Eye data-icon="inline-start" /> View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <div className="w-20">
                <Select
                  value={String(pageSize)}
                  onValueChange={(val: string | null) => {
                    if (val) {
                      setPageSize(Number(val));
                      setPageNumber(0);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
                    <SelectValue placeholder={String(pageSize)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <span className="ml-2 text-slate-400">
                Page {pageNumber + 1} of {totalPages} ({totalElements} total items)
              </span>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(Math.max(pageNumber - 1, 0))}
                disabled={pageNumber === 0}
                className="h-8 px-3 rounded-xl text-xs font-semibold cursor-pointer border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="size-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages - 1))}
                disabled={pageNumber >= totalPages - 1}
                className="h-8 px-3 rounded-xl text-xs font-semibold cursor-pointer border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                Next <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Action Detail Modal */}
      <ModerationActionDetailModal
        actionId={selectedActionId}
        isOpen={!!selectedActionId}
        onClose={() => setSelectedActionId(null)}
      />
    </div>
  );
}
