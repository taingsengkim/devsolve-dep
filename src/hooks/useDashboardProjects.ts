"use client";

import { useDeferredValue, useState } from "react";

import {
  DASHBOARD_COLUMNS,
  DASHBOARD_PROJECTS,
} from "@/components/dashboard/mock-data";
import type {
  DashboardStatusFilter,
  DashboardVisibleColumn,
} from "@/components/dashboard/types";

export function useDashboardProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<DashboardStatusFilter>("all");
  const [visibleColumns, setVisibleColumns] = useState<
    Set<DashboardVisibleColumn>
  >(() => new Set(DASHBOARD_COLUMNS.map((column) => column.key)));
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();

  const filteredProjects = DASHBOARD_PROJECTS.filter((project) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      project.name.toLowerCase().includes(normalizedQuery) ||
      project.repository.toLowerCase().includes(normalizedQuery) ||
      project.team.toLowerCase().includes(normalizedQuery) ||
      project.tech.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      statusFilter === "all" || project.status.variant === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = DASHBOARD_PROJECTS.filter(
    (project) => project.status.variant === "active"
  ).length;
  const reviewingCount = DASHBOARD_PROJECTS.filter(
    (project) => project.status.variant === "reviewing"
  ).length;
  const onHoldCount = DASHBOARD_PROJECTS.filter(
    (project) => project.status.variant === "onHold"
  ).length;
  const squadCount = new Set(DASHBOARD_PROJECTS.map((project) => project.team))
    .size;

  const toggleColumn = (column: DashboardVisibleColumn) => {
    setVisibleColumns((current) => {
      const next = new Set(current);

      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }

      return next;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    visibleColumns,
    toggleColumn,
    filteredProjects,
    totalProjects: DASHBOARD_PROJECTS.length,
    activeCount,
    reviewingCount,
    onHoldCount,
    squadCount,
  };
}
