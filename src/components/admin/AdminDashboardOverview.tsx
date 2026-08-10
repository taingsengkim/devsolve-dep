"use client";

import React from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { AdminStatGrid } from "./AdminStatGrid";
import { AdminActivityChart } from "./AdminActivityChart";
import { AdminReportStatusDonut } from "./AdminReportStatusDonut";
import { AdminActionQueueCard } from "./AdminActionQueueCard";
import { AdminQuickModules } from "./AdminQuickModules";

export function AdminDashboardOverview() {
  const { adminData, isLoading, isFetching, refetch, pieData, timeRange } =
    useAdminOverview();

  if (isLoading || !adminData) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-16 bg-slate-200/60 dark:bg-neutral-800 rounded-xl" />
        <div className="h-32 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
            Platform Operations
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer shadow-2xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <RefreshCw className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <AdminStatGrid stats={adminData.stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AdminActivityChart
          data={adminData.activityChart}
          timeRange={timeRange}
        />
        <AdminReportStatusDonut
          pieData={pieData}
          total={adminData.reportStatusBreakdown.total}
        />
      </div>

      {/* Admin Queue & Quick Links Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AdminActionQueueCard
          items={adminData.actionQueue.items}
          totalCount={adminData.actionQueue.totalCount}
        />
        <AdminQuickModules />
      </div>
    </motion.div>
  );
}
