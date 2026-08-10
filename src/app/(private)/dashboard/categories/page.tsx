"use client";

export const dynamic = "force-dynamic";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AlertCircle, ArrowLeft, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryStatCards } from "@/components/admin/categories/CategoryStatCards";
import {
  CategoryFiltersBar,
  type CategoryScopeFilter,
  type CategoryStateFilter,
} from "@/components/admin/categories/CategoryFiltersBar";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryFormDialog } from "@/components/admin/categories/CategoryFormDialog";
import {
  useGetCategoriesQuery,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();

  const [stateFilter, setStateFilter] = useState<CategoryStateFilter>("ALL");
  const [scopeFilter, setScopeFilter] = useState<CategoryScopeFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  /* Keys the dialog body so each open mounts fresh state. Bumped from the
     click handlers, which keeps it out of an effect. */
  const [session, setSession] = useState(0);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesScope =
        scopeFilter === "ALL" || category.scope === scopeFilter;
      const matchesState =
        stateFilter === "ALL" ||
        (stateFilter === "ACTIVE" ? category.isActive : !category.isActive);
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query);

      return matchesScope && matchesState && matchesSearch;
    });
  }, [categories, scopeFilter, stateFilter, searchQuery]);

  /* Counts describe the whole set, not the filtered view, so the tab badges
     stay put as the filters move. */
  const counts = useMemo(() => {
    const active = categories.filter((c) => c.isActive).length;
    return {
      all: categories.length,
      active,
      inactive: categories.length - active,
    };
  }, [categories]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setSession((n) => n + 1);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((category: CategoryResponse) => {
    setEditing(category);
    setSession((n) => n + 1);
    setDialogOpen(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Categories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The buckets problems and showcases are filed under, and the order
            they appear in.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {counts.inactive > 0 && (
            <Badge
              variant="outline"
              className="h-9 gap-2 rounded-xl border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <span className="size-2 rounded-full bg-slate-400" />
              <span>
                {counts.inactive} inactive
              </span>
            </Badge>
          )}
          <Button
            onClick={openCreate}
            className="h-9 cursor-pointer rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-2xs hover:bg-blue-700"
          >
            <Plus data-icon="inline-start" />
            New category
          </Button>
        </div>
      </header>

      {/* STAT CARDS */}
      {!isLoading && !isError && <CategoryStatCards categories={categories} />}
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
      {!isError && (
        <CategoryFiltersBar
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          scopeFilter={scopeFilter}
          onScopeFilterChange={setScopeFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          counts={counts}
        />
      )}

      {/* DATA TABLE */}
      <main className="flex flex-col gap-3">
        {isError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <span>
              Categories could not be loaded. Check that you are signed in as an
              admin, then try again.
            </span>
          </div>
        ) : isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <CategoryTable
            categories={filtered}
            totalCount={categories.length}
            onEdit={openEdit}
          />
        )}
      </main>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        session={session}
      />
    </motion.div>
  );
}
