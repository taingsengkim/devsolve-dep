"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
} from "@/lib/redux/services/adminApi";
import { UserStatCards } from "@/components/admin/users/UserStatCards";
import {
  UserFiltersBar,
  type RoleFilter,
  type StatusFilter,
} from "@/components/admin/users/UserFiltersBar";
import { UserTableRow } from "@/components/admin/users/UserTableRow";

export default function AdminUsersPage() {
  const { data: users = [], isLoading, isFetching } = useGetAdminUsersQuery();
  const [updateUser] = useUpdateAdminUserStatusMutation();

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Counts ─────────────────────────────────────────────────────── */
  const counts = {
    all: users.length,
    user: users.filter((u) => u.role === "USER").length,
    company: users.filter((u) => u.role === "COMPANY").length,
    admin: users.filter((u) => u.role === "ADMIN").length,
    moderator: users.filter((u) => u.role === "MODERATOR").length,
  };

  const statusCounts = {
    all: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
    pending: users.filter((u) => u.status === "PENDING").length,
  };

  /* ── Filtering ───────────────────────────────────────────────────── */
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  /* ── Handlers ────────────────────────────────────────────────────── */
  const handleUpdateStatus = async (id: string, status: "ACTIVE" | "SUSPENDED") => {
    try {
      await updateUser({ id, status });
      toast.success(
        status === "ACTIVE" ? "Account activated." : "Account suspended.",
        { description: `User status updated successfully.` }
      );
    } catch {
      toast.error("Failed to update user status.");
    }
  };

  const handleUpdateRole = async (
    id: string,
    role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR"
  ) => {
    try {
      const user = users.find((u) => u.id === id);
      const safeStatus: "ACTIVE" | "SUSPENDED" =
        user?.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE";
      await updateUser({ id, status: safeStatus, role });
      toast.success("Role updated.", { description: `User role changed to ${role}.` });
    } catch {
      toast.error("Failed to update user role.");
    }
  };

  const handleResetFilters = () => {
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters =
    roleFilter !== "ALL" || statusFilter !== "ALL" || searchQuery !== "";

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
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            Admin / User Management
          </div>
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
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      )}

      {/* FILTER BAR */}
      <UserFiltersBar
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={counts}
        statusCounts={statusCounts}
      />

      {/* USER LIST */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Users Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No users match your current role, status, or search criteria.
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="rounded-xl border-slate-300 dark:border-slate-700 font-semibold gap-1.5 text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Results count */}
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 px-1">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={index}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateRole={handleUpdateRole}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </motion.div>
  );
}
