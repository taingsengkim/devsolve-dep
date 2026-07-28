"use client";

import { motion } from "motion/react";

import { DashboardOverviewHeader } from "@/components/dashboard/DashboardOverviewHeader";
import { DashboardProjectsCard } from "@/components/dashboard/DashboardProjectsCard";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { useDashboardProjects } from "@/hooks/useDashboardProjects";

export default function Page() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    visibleColumns,
    toggleColumn,
    filteredProjects,
    totalProjects,
    activeCount,
    reviewingCount,
    onHoldCount,
    squadCount,
  } = useDashboardProjects();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 pb-12"
    >
      <DashboardOverviewHeader
        totalProjects={totalProjects}
        squadCount={squadCount}
      />
      <DashboardStatsGrid
        totalProjects={totalProjects}
        activeCount={activeCount}
        reviewingCount={reviewingCount}
        onHoldCount={onHoldCount}
        squadCount={squadCount}
      />
      <DashboardProjectsCard
        projects={filteredProjects}
        totalProjects={totalProjects}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />
    </motion.section>
  );
}
