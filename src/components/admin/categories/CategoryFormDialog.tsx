"use client";

import React, { useState } from "react";
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
import { CategoryIconField, type IconIntent } from "./CategoryIconField";
import {
  CATEGORY_SCOPES,
  categoryCreateSchema,
  type CategoryCreateInput,
  type CategoryCreateValues,
} from "@/lib/validations/category";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUploadCategoryIconMutation,
  useRemoveCategoryIconMutation,
  type CategoryResponse,
} from "@/lib/redux/services/categoriesApi";

function errorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "data" in error) {
    const message = (error as { data?: { message?: string } }).data?.message;
    if (typeof message === "string" && message) return message;
  }
  return undefined;
}

/* ── The form itself ──────────────────────────────────────────────────
   Split out and mounted under a per-open key so its state initialises
   rather than being reset by an effect — reopening the same row after a
   cancelled edit gets clean fields either way, without a render cascade. */

interface CategoryFormBodyProps {
  category: CategoryResponse | null;
  onClose: () => void;
}

function CategoryFormBody({ category, onClose }: CategoryFormBodyProps) {
  const isEdit = Boolean(category);
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [uploadIcon, { isLoading: uploadingIcon }] =
    useUploadCategoryIconMutation();
  const [removeIcon, { isLoading: removingIcon }] =
    useRemoveCategoryIconMutation();

  const saving = creating || updating || uploadingIcon || removingIcon;

  const [icon, setIcon] = useState<IconIntent>({ kind: "keep" });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreateInput, unknown, CategoryCreateValues>({
    resolver: zodResolver(categoryCreateSchema),
    /* `iconUrl` is absent on purpose — the icon field drives it at submit. */
    defaultValues: category
      ? {
          name: category.name,
          scope: category.scope,
          description: category.description ?? "",
          sortOrder: category.sortOrder ?? 0,
          isActive: category.isActive ?? true,
        }
      : {
          name: "",
          scope: "PROBLEM",
          description: "",
          sortOrder: 0,
          isActive: true,
        },
  });

  /**
   * The icon lives behind its own endpoint, so saving is two-phase whenever a
   * file is involved: the category has to exist before `PUT /{id}/icon` has an
   * id to address. A URL needs no second call — the backend accepts `iconUrl`
   * on the category body directly.
   */
  const applyIcon = async (id: string) => {
    if (icon.kind === "file") {
      await uploadIcon({ id, file: icon.file }).unwrap();
    } else if (icon.kind === "remove") {
      await removeIcon(id).unwrap();
    }
  };

  const onSubmit = async (values: CategoryCreateValues) => {
    const body = {
      ...values,
      iconUrl: icon.kind === "url" ? icon.url : undefined,
    };

    let saved: CategoryResponse;

    try {
      saved = category
        ? await updateCategory({ id: category.id, body }).unwrap()
        : await createCategory(body).unwrap();
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update category." : "Failed to create category.",
        { description: errorMessage(error) },
      );
      return;
    }

    try {
      await applyIcon(saved.id);
    } catch (error) {
      // The category itself saved — say so, rather than implying the whole
      // thing failed and inviting a duplicate.
      toast.warning(
        isEdit
          ? "Category updated, but the icon didn't."
          : "Category created, but the icon didn't.",
        {
          description:
            errorMessage(error) ?? "Reopen it to try the icon again.",
        },
      );
      onClose();
      return;
    }

    toast.success(isEdit ? "Category updated." : "Category created.");
    onClose();
  };

  return (
    <>
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
          <CategoryIconField
            currentUrl={category?.iconUrl}
            value={icon}
            onChange={setIcon}
          />

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
                  Inactive categories stay on existing posts but disappear from
                  the pickers.
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
            onClick={onClose}
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
    </>
  );
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Absent means create; present means edit that row. */
  category?: CategoryResponse | null;
  /**
   * Bumped by the caller each time the dialog is opened. Used as the body's
   * key so every open starts from fresh state — the dialog itself stays
   * mounted, so the open and close animations still play.
   */
  session: number;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  session,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <CategoryFormBody
          key={session}
          category={category ?? null}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
