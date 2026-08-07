"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORY_SCOPES,
  categoryCreateSchema,
  type CategoryCreateInput,
  type CategoryCreateValues,
} from "@/lib/validations/category";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Absent means create; present means edit that row. */
  category?: CategoryResponse | null;
}

const emptyValues: CategoryCreateInput = {
  name: "",
  scope: "PROBLEM",
  description: "",
  iconUrl: "",
  sortOrder: 0,
  isActive: true,
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const saving = creating || updating;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryCreateInput, unknown, CategoryCreateValues>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: emptyValues,
  });

  /* The dialog is mounted once and reused, so the fields are refilled each
     time it opens rather than on mount. */
  useEffect(() => {
    if (!open) return;

    reset(
      category
        ? {
            name: category.name,
            scope: category.scope,
            description: category.description ?? "",
            iconUrl: category.iconUrl ?? "",
            sortOrder: category.sortOrder ?? 0,
            isActive: category.isActive ?? true,
          }
        : emptyValues,
    );
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryCreateValues) => {
    try {
      if (category) {
        await updateCategory({ id: category.id, body: values }).unwrap();
        toast.success("Category updated.");
      } else {
        await createCategory(values).unwrap();
        toast.success("Category created.");
      }
      onOpenChange(false);
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? ((error as { data?: { message?: string } }).data?.message ?? null)
          : null;

      toast.error(
        isEdit ? "Failed to update category." : "Failed to create category.",
        { description: message ?? undefined },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEdit ? "Edit category" : "New category"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {isEdit
              ? "Changes apply everywhere this category is already used."
              : "Categories group problems and showcases on the public index."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
            <div className="space-y-2">
              <label
                htmlFor="category-name"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Name
              </label>
              <Input
                id="category-name"
                maxLength={50}
                placeholder="e.g. API Security"
                {...register("name")}
                className="h-11 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
              />
              {errors.name?.message && (
                <p className="text-sm font-medium text-rose-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category-scope"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Scope
              </label>
              <Controller
                control={control}
                name="scope"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                  >
                    <SelectTrigger
                      id="category-scope"
                      className="h-11 w-full rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
                    >
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white p-1">
                      {CATEGORY_SCOPES.map((scope) => (
                        <SelectItem
                          key={scope}
                          value={scope}
                          className="cursor-pointer rounded-lg py-2 text-base font-medium capitalize"
                        >
                          {scope.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.scope?.message && (
                <p className="text-sm font-medium text-rose-600">
                  {errors.scope.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category-description"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Description
            </label>
            <Textarea
              id="category-description"
              rows={3}
              maxLength={500}
              placeholder="What belongs in this category?"
              {...register("description")}
              className="rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
            />
            {errors.description?.message && (
              <p className="text-sm font-medium text-rose-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <div className="space-y-2">
              <label
                htmlFor="category-icon"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Icon URL
              </label>
              <Input
                id="category-icon"
                maxLength={255}
                placeholder="https://…/icon.svg"
                {...register("iconUrl")}
                className="h-11 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
              />
              {errors.iconUrl?.message && (
                <p className="text-sm font-medium text-rose-600">
                  {errors.iconUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category-sort"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Sort order
              </label>
              <Input
                id="category-sort"
                type="number"
                min={0}
                {...register("sortOrder")}
                className="h-11 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
              />
              {errors.sortOrder?.message && (
                <p className="text-sm font-medium text-rose-600">
                  {errors.sortOrder.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Active
                  </p>
                  <p className="text-sm text-slate-500">
                    Inactive categories stay on existing posts but disappear
                    from the pickers.
                  </p>
                </div>
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
