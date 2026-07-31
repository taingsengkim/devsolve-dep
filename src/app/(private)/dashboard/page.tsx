"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { motion } from "motion/react";
import { useGetDashboardOverviewQuery } from "@/lib/redux/services/dashboardApi";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatCards } from "@/components/dashboard/DashboardStatCards";
import { DashboardActionQueue } from "@/components/dashboard/DashboardActionQueue";
import { DashboardMyPrograms } from "@/components/dashboard/DashboardMyPrograms";
import { DashboardReportStatus } from "@/components/dashboard/DashboardReportStatus";
import { DashboardReportSeverity } from "@/components/dashboard/DashboardReportSeverity";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";

export default function DashboardPage() {
  const { user } = useSidebarAuth();
  const isAdminUser = user?.roles?.includes("ADMIN") || user?.role?.includes("ADMIN");

  const viewMode = isAdminUser ? "ADMIN" : "COMPANY";

  const { data: dashboardData, isLoading, isFetching, refetch } = useGetDashboardOverviewQuery();

  if (viewMode === "ADMIN") {
    return <AdminDashboardOverview />;
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-14 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-80 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
          <div className="lg:col-span-7 h-80 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-72 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
          ))}
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
      {/* Page Header with option to switch back to Admin Platform View */}
      <DashboardHeader onRefresh={refetch} isRefreshing={isFetching} />

      {/* Top 4 Stat Metric Cards */}
      <DashboardStatCards stats={dashboardData.stats} />

      {/* Middle Section: Action Queue + My Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <DashboardActionQueue
            items={dashboardData.actionQueue.items}
            totalCount={dashboardData.actionQueue.totalCount}
          />
        </div>
        <div className="lg:col-span-7">
          <DashboardMyPrograms programs={dashboardData.myPrograms} />
        </div>
      </div>

      {/* Bottom Section: Status Breakdown + Severity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardReportStatus distribution={dashboardData.reportStatus} />
        <DashboardReportSeverity distribution={dashboardData.reportSeverity} />
      </div>
    </motion.div>
  );
}
