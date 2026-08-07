"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
} from "@/lib/redux/services/admin/adminUsersApi";
import { AdminUserItem, AdminUserSummaryItem } from "@/lib/types/admin/types";
import { UserStatCards } from "@/components/admin/users/UserStatCards";
import {
  UserFiltersBar,
  type StatusFilter,
} from "@/components/admin/users/UserFiltersBar";
import { UserDataTable } from "@/components/admin/users/UserDataTable";
import { getUserColumns } from "@/components/admin/users/userColumns";
import { ModerationActionDialog } from "@/components/admin/ModerationActionDialog";

import type { ModerationActionType } from "@/lib/types/admin/types";

export default function AdminUsersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [moderateTarget, setModerateTarget] = useState<{
    user: AdminUserItem;
    actionType: ModerationActionType;
  } | null>(null);

  // Overall dataset query for stat cards and tab counts
  const { data: overallResponse } = useGetAdminUsersQuery({
    pageSize: 100,
  });

  // Filtered dataset query for table data
  const { data: response, isLoading, isFetching } = useGetAdminUsersQuery({
    query: searchQuery.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    pageNumber: pageIndex,
    pageSize: pageSize,
  });

  const [updateUser] = useUpdateAdminUserStatusMutation();

  function extractUserRole(item: AdminUserSummaryItem): "USER" | "COMPANY" | "ADMIN" {
    const rolesList: string[] = [
      ...(item.roles || []),
      ...(item.realm_access?.roles || []),
      ...(item.realmAccess?.roles || []),
      ...(item.role ? [item.role] : []),
    ].map((r) => String(r).toUpperCase());

    if (rolesList.includes("ADMIN")) return "ADMIN";
    if (
      rolesList.includes("COMPANY") ||
      rolesList.includes("ORGANIZATION") ||
      rolesList.includes("ORG")
    ) {
      return "COMPANY";
    }
    return "USER";
  }

  /* ── Map overall items for Stat Cards ──────────────────────────────────── */
  const overallUsers: AdminUserItem[] = useMemo(() => {
    if (!overallResponse?.content) return [];
    return overallResponse.content.map((item) => ({
      id: item.id,
      name: item.fullName || item.email || "Unknown User",
      email: item.email || "",
      role: extractUserRole(item),
      status: (item.status as "ACTIVE" | "SUSPENDED" | "PENDING" | "REMOVED") || "ACTIVE",
      joinedDate: item.createdAt || new Date().toISOString(),
      reportsSubmitted: item.totalReports ?? 0,
      validReports: item.validReports ?? 0,
      criticalReports: item.criticalReports ?? 0,
      reputation: item.reputation ?? 0,
      country: item.country,
      avatarUrl: item.avatarUrl,
    }));
  }, [overallResponse]);

  /* ── Map table items ───────────────────────────────────────────────────── */
  const users: AdminUserItem[] = useMemo(() => {
    if (!response?.content) return [];
    return response.content.map((item) => ({
      id: item.id,
      name: item.fullName || item.email || "Unknown User",
      email: item.email || "",
      role: extractUserRole(item),
      status: (item.status as "ACTIVE" | "SUSPENDED" | "PENDING" | "REMOVED") || "ACTIVE",
      joinedDate: item.createdAt || new Date().toISOString(),
      reportsSubmitted: item.totalReports ?? 0,
      validReports: item.validReports ?? 0,
      criticalReports: item.criticalReports ?? 0,
      reputation: item.reputation ?? 0,
      country: item.country,
      avatarUrl: item.avatarUrl,
    }));
  }, [response]);

  /* ── Counts (always derived from overallResponse if available) ────────── */
  const statusCounts = useMemo(() => {
    const items = overallResponse?.content || response?.content || [];
    const total = overallResponse?.totalElements ?? response?.totalElements ?? 0;
    return {
      all: total,
      active: items.filter((u) => u.status === "ACTIVE").length,
      suspended: items.filter((u) => u.status === "SUSPENDED").length,
      pending: items.filter((u) => u.status === "PENDING").length,
      removed: items.filter((u) => u.status === "REMOVED").length,
    };
  }, [overallResponse, response]);

  /* ── Handlers ────────────────────────────────────────────────────── */
  const handleStatusFilterChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setPageIndex(0);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPageIndex(0);
  }, []);

  const handleUpdateStatus = useCallback(
    async (id: string, status: "ACTIVE" | "SUSPENDED") => {
      try {
        await updateUser({
          id,
          status,
          reason: `Status set to ${status} via Admin Users dashboard.`,
        }).unwrap();
        toast.success(
          status === "ACTIVE" ? "Account activated." : "Account suspended.",
          { description: "User status updated successfully." }
        );
      } catch (err: unknown) {
        const message =
          (err as { data?: { message?: string } })?.data?.message ||
          "Failed to update user status.";
        toast.error(message);
      }
    },
    [updateUser]
  );

  const handleModerateUser = useCallback(
    (user: AdminUserItem, actionType?: ModerationActionType) => {
      setModerateTarget({ user, actionType: actionType || "WARN" });
    },
    []
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onUpdateStatus: handleUpdateStatus,
        onModerateUser: handleModerateUser,
      }),
    [handleUpdateStatus, handleModerateUser]
  );

  const suspendedCount = statusCounts.suspended;
  const totalPages = response?.totalPages ?? 1;
  const totalElements = response?.totalElements ?? 0;

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Users
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage researchers, company representatives, admins, and moderators across the platform.
          </p>
        </div>

        {/* Suspended alert badge */}
        {suspendedCount > 0 && (
          <div className="shrink-0 flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              {suspendedCount} suspended account{suspendedCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </header>

      {/* STAT CARDS */}
      {!isLoading && (
        <UserStatCards
          users={overallUsers.length > 0 ? overallUsers : users}
          totalCount={overallResponse?.totalElements ?? response?.totalElements}
        />
      )}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      )}

      {/* FILTER BAR */}
      <UserFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        statusCounts={statusCounts}
      />

      {/* DATA TABLE */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <UserDataTable
            columns={columns}
            data={users}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={totalPages}
            totalElements={totalElements}
            onPageChange={setPageIndex}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageIndex(0);
            }}
          />
        )}
      </main>

      {/* Moderation Action Dialog for Selected User */}
      <ModerationActionDialog
        target={
          moderateTarget
            ? {
                id: moderateTarget.user.id,
                name: moderateTarget.user.name,
                subtitle: moderateTarget.user.email,
                type: "USER",
                status: moderateTarget.user.status,
              }
            : null
        }
        actionType={moderateTarget?.actionType}
        isOpen={!!moderateTarget}
        onClose={() => setModerateTarget(null)}
      />
    </motion.div>
  );
}
