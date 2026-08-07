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
import { Switch } from "@/components/ui/switch";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";

interface CategoryTableProps {
  categories: CategoryResponse[];
  onEdit: (category: CategoryResponse) => void;
}

const SCOPE_STYLES: Record<string, string> = {
  PROBLEM:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  SHOWCASE:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
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

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          <Tags className="size-6" />
        </span>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          No categories yet
        </h3>
        <p className="mt-1 text-base text-slate-500">
          Create one to give problems and showcases somewhere to live.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="px-5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Name
              </TableHead>
              <TableHead className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Scope
              </TableHead>
              <TableHead className="hidden text-sm font-semibold text-slate-600 lg:table-cell dark:text-slate-300">
                Description
              </TableHead>
              <TableHead className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Order
              </TableHead>
              <TableHead className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Active
              </TableHead>
              <TableHead className="pr-5 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
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
                  <TableCell className="px-5 py-4">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </p>
                    <p className="font-mono text-sm text-slate-400">
                      {category.slug}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${
                        SCOPE_STYLES[category.scope] ?? ""
                      }`}
                    >
                      {category.scope.toLowerCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden max-w-md lg:table-cell">
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {category.description || "—"}
                    </p>
                  </TableCell>

                  <TableCell className="text-base text-slate-600 tabular-nums dark:text-slate-300">
                    {category.sortOrder ?? "—"}
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={category.isActive ?? false}
                      onCheckedChange={(next) => toggleActive(category, next)}
                    />
                  </TableCell>

                  <TableCell className="pr-5">
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
