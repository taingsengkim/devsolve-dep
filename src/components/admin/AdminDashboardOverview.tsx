"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { AdminStatGrid } from "./AdminStatGrid";
import { AdminReportStatusDonut } from "./AdminReportStatusDonut";
import { AdminActionQueueCard } from "./AdminActionQueueCard";
import { AdminQuickModules } from "./AdminQuickModules";
import { AdminOverviewSnapshot } from "./AdminOverviewSnapshot";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminDashboardOverview() {
  const {
    overview,
    adminData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    pieData,
  } = useAdminOverview();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12 animate-pulse"
      >
        <div className="h-16 bg-slate-200/60 dark:bg-neutral-800 rounded-xl" />
        <div className="h-32 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-slate-200/60 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </motion.div>
    );
  }

  if (isError || !overview || !adminData) {
    const message =
      (error as { data?: { message?: string } } | undefined)?.data?.message ??
      "The platform overview could not be loaded.";

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <Card className="mx-auto max-w-xl rounded-2xl text-center">
          <CardHeader className="justify-items-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <AlertTriangle className="size-7" aria-hidden="true" />
            </span>
            <CardTitle className="text-xl font-bold">
              Admin overview unavailable
            </CardTitle>
            <CardDescription className="text-base">{message}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
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
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
            Platform Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Live platform totals and moderation workload
            {overview.generatedAt
              ? ` · Updated ${new Date(overview.generatedAt).toLocaleString()}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer shadow-2xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <RefreshCw
              data-icon="inline-start"
              className={isFetching ? "animate-spin" : undefined}
            />
            Refresh
          </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <AdminStatGrid stats={adminData.stats} />

      {/* Current platform state and report distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AdminOverviewSnapshot overview={overview} />
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
