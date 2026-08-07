"use client";

export const dynamic = "force-dynamic";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryFormDialog } from "@/components/admin/categories/CategoryFormDialog";
import {
  useGetCategoriesQuery,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";
import { CATEGORY_SCOPES } from "@/lib/validations/category";

type ScopeFilter = "ALL" | (typeof CATEGORY_SCOPES)[number];
type StateFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function AdminCategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  const [scope, setScope] = useState<ScopeFilter>("ALL");
  const [state, setState] = useState<StateFilter>("ALL");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  /* Keys the dialog body so each open mounts fresh state. Bumped from the
     click handlers, which keeps it out of an effect. */
  const [session, setSession] = useState(0);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesScope = scope === "ALL" || category.scope === scope;
      const matchesState =
        state === "ALL" ||
        (state === "ACTIVE" ? category.isActive : !category.isActive);
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query);

      return matchesScope && matchesState && matchesSearch;
    });
  }, [categories, scope, state, search]);

  const activeCount = categories.filter((c) => c.isActive).length;

  const openCreate = () => {
    setEditing(null);
    setSession((n) => n + 1);
    setDialogOpen(true);
  };

  const openEdit = (category: CategoryResponse) => {
    setEditing(category);
    setSession((n) => n + 1);
    setDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Categories
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            The buckets problems and showcases are filed under, and the order
            they appear in.
          </p>
        </div>

        <Button
          onClick={openCreate}
          className="h-11 shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="size-4" />
          New category
        </Button>
      </header>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or slug…"
            className="h-11 rounded-xl border-slate-300 bg-white pl-10 text-base dark:border-slate-700"
          />
        </div>

        <Select
          value={scope}
          onValueChange={(value) => value && setScope(value as ScopeFilter)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white text-base sm:w-44 dark:border-slate-700">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white p-1">
            <SelectItem value="ALL" className="rounded-lg py-2 text-base">
              All scopes
            </SelectItem>
            {CATEGORY_SCOPES.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="rounded-lg py-2 text-base capitalize"
              >
                {option.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={state}
          onValueChange={(value) => value && setState(value as StateFilter)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white text-base sm:w-40 dark:border-slate-700">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white p-1">
            <SelectItem value="ALL" className="rounded-lg py-2 text-base">
              All
            </SelectItem>
            <SelectItem value="ACTIVE" className="rounded-lg py-2 text-base">
              Active
            </SelectItem>
            <SelectItem value="INACTIVE" className="rounded-lg py-2 text-base">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-base font-medium text-rose-700">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <span>
            Categories could not be loaded. Check that you are signed in as an
            admin, then try again.
          </span>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-500">
            {filtered.length} of {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"} · {activeCount}{" "}
            active
          </p>

          <CategoryTable categories={filtered} onEdit={openEdit} />
        </>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        session={session}
      />
    </motion.div>
  );
}
