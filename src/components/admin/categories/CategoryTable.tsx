"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Pencil, Tags, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";

interface CategoryTableProps {
  categories: CategoryResponse[];
  /** Everything before filtering, so the footer can say what was hidden. */
  totalCount?: number;
  onEdit: (category: CategoryResponse) => void;
}

/**
 * A stored `iconUrl` is not necessarily a reachable one — the backend
 * currently hands back an internal MinIO host over plain http, which no
 * browser can load. Falling back to the glyph on error keeps the column
 * readable instead of filling it with broken-image icons.
 */
function CategoryIcon({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      {url && !failed ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt=""
          className="size-full object-contain p-1"
          onError={() => setFailed(true)}
        />
      ) : (
        <Tags className="size-4 text-slate-300 dark:text-slate-600" />
      )}
    </span>
  );
}

export function CategoryTable({
  categories,
  totalCount,
  onEdit,
}: CategoryTableProps) {
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
  const [pendingDelete, setPendingDelete] = useState<CategoryResponse | null>(
    null,
  );

  const toggleActive = async (category: CategoryResponse, next: boolean) => {
    try {
      await updateCategory({
        id: category.id,
        body: { isActive: next },
      }).unwrap();
      toast.success(next ? "Category activated." : "Category deactivated.");
    } catch {
      toast.error("Failed to update the category.");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete.id).unwrap();
      toast.success("Category deleted.");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete the category.", {
        description: "It may still be in use by existing posts.",
      });
    }
  };

  const shown = categories.length;
  const total = totalCount ?? shown;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scope
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell dark:text-slate-400">
                Description
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Order
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active
              </TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shown === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-48 p-0 text-center">
                  <Card className="gap-3 border-none bg-transparent py-8 shadow-none">
                    <CardHeader className="grid justify-items-center gap-3 px-8 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <Tags className="size-6" />
                      </div>
                      <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {total === 0
                          ? "No categories yet"
                          : "No matching categories found"}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                        {total === 0
                          ? "Create one to give problems and showcases somewhere to live."
                          : "Try another search, scope, or state filter."}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TableCell>
              </TableRow>
            )}

            <AnimatePresence initial={false}>
              {categories.map((category) => (
                <motion.tr
                  key={category.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3 py-0.5">
                      <CategoryIcon url={category.iconUrl} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {category.name}
                        </p>
                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                          {category.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge variant="secondary" className="rounded-lg capitalize">
                      {category.scope.toLowerCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden max-w-md px-4 py-3 lg:table-cell">
                    <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                      {category.description || "—"}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm font-medium text-slate-600 tabular-nums dark:text-slate-400">
                    {category.sortOrder ?? "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Switch
                      checked={category.isActive ?? false}
                      onCheckedChange={(next) => toggleActive(category, next)}
                      aria-label={`${category.isActive ? "Deactivate" : "Activate"} ${category.name}`}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* Footer. `GET /categories` returns the whole set rather than a page,
            so there is nothing to page through — only a count to state. */}
        {shown > 0 && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {shown}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {total}
              </span>{" "}
              {total === 1 ? "category" : "categories"}
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete “{pendingDelete?.name}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Posts already filed under this category keep pointing at it. If
              you only want it out of the pickers, switch it to inactive
              instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
