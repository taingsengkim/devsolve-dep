"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
} from "@/lib/redux/services/adminApi";
import { UserStatCards } from "@/components/admin/users/UserStatCards";
import {
  UserFiltersBar,
  type StatusFilter,
} from "@/components/admin/users/UserFiltersBar";
import { UserDataTable } from "@/components/admin/users/UserDataTable";
import { getUserColumns } from "@/components/admin/users/userColumns";

export default function AdminUsersPage() {
  const { data: users = [], isLoading, isFetching } = useGetAdminUsersQuery();
  const [updateUser] = useUpdateAdminUserStatusMutation();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Counts ─────────────────────────────────────────────────────── */
  const statusCounts = {
    all: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
    pending: users.filter((u) => u.status === "PENDING").length,
  };

  /* ── Filtering ───────────────────────────────────────────────────── */
  const filteredUsers = users.filter((u) => {
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  /* ── Handlers ────────────────────────────────────────────────────── */
  const handleUpdateStatus = useCallback(
    async (id: string, status: "ACTIVE" | "SUSPENDED") => {
      try {
        await updateUser({ id, status }).unwrap();
        toast.success(
          status === "ACTIVE" ? "Account activated." : "Account suspended.",
          { description: `User status updated successfully.` }
        );
      } catch {
        toast.error("Failed to update user status.");
      }
    },
    [updateUser]
  );

  const handleUpdateRole = useCallback(
    async (
      id: string,
      role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
    ) => {
      try {
        await updateUser({ id, role }).unwrap();
        toast.success("Role updated.", { description: `User role changed to ${role}.` });
      } catch {
        toast.error("Failed to update user role.");
      }
    },
    [updateUser]
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onUpdateStatus: handleUpdateStatus,
        onUpdateRole: handleUpdateRole,
      }),
    [handleUpdateStatus, handleUpdateRole]
  );

  const suspendedCount = statusCounts.suspended;

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
      {!isLoading && <UserStatCards users={users} />}
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
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusCounts={statusCounts}
      />

      {/* DATA TABLE */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <UserDataTable columns={columns} data={filteredUsers} />
        )}
      </main>
    </motion.div>
  );
}


