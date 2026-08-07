import * as z from "zod";

export const CATEGORY_SCOPES = ["PROBLEM", "SHOWCASE"] as const;

export type CategoryScope = (typeof CATEGORY_SCOPES)[number];

/** Mirrors the backend `CategoryRequest` — `name` and `scope` are required. */
export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must not exceed 50 characters"),
  scope: z.enum(CATEGORY_SCOPES, { message: "Pick a scope" }),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  iconUrl: z
    .string()
    .trim()
    .max(255, "Icon URL must not exceed 255 characters")
    .optional(),
  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative")
    .optional(),
  isActive: z.boolean().optional(),
});

/** Mirrors `CategoryPatchRequest` — every field optional, plus `slug`. */
export const categoryPatchSchema = categoryCreateSchema
  .extend({
    slug: z
      .string()
      .trim()
      .max(50, "Slug must not exceed 50 characters")
      .optional(),
  })
  .partial();

export type CategoryCreateInput = z.input<typeof categoryCreateSchema>;
export type CategoryCreateValues = z.output<typeof categoryCreateSchema>;
export type CategoryPatchValues = z.output<typeof categoryPatchSchema>;
