import * as z from "zod";

/**
 * Mirrors the backend `SolutionRequest`. Only `description` is required; the
 * two links are optional and capped the way the backend caps them.
 */
export const solutionCreateSchema = z.object({
  description: z
    .string()
    .min(1, "A solution needs a description")
    .max(20_000, "Description must not exceed 20000 characters"),
  videoUrl: z
    .string()
    .max(500, "Video URL must not exceed 500 characters")
    .optional(),
  diagramUrl: z
    .string()
    .max(500, "Diagram URL must not exceed 500 characters")
    .optional(),
});

/** Validated body sent to `POST /api/v1/problems/{problemId}/solutions`. */
export type CreateSolutionRequest = z.output<typeof solutionCreateSchema>;

/**
 * Form-level rules can be stricter than the wire contract. An answer worth
 * posting says something, and a link that is not a URL helps nobody.
 */
export const solutionFormSchema = solutionCreateSchema.extend({
  description: z
    .string()
    .trim()
    .min(30, "Explain the fix in at least 30 characters")
    .max(20_000, "Description must not exceed 20000 characters"),
  videoUrl: z
    .union([z.literal(""), z.url("Enter a full URL, starting with https://")])
    .optional(),
  diagramUrl: z
    .union([z.literal(""), z.url("Enter a full URL, starting with https://")])
    .optional(),
});

export type SolutionFormValues = z.output<typeof solutionFormSchema>;
