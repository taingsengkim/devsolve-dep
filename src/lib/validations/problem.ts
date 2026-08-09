import * as z from "zod";

/** Values accepted by `CreateProblemRequest.sdlcPhase`. */
export const SDLC_PHASES = [
  "PLANNING",
  "REQUIREMENTS_ANALYSIS",
  "DESIGN",
  "DEVELOPMENT",
  "TESTING",
  "DEPLOYMENT",
  "MAINTENANCE",
] as const;

export type SdlcPhase = (typeof SDLC_PHASES)[number];

/** How each phase is written for a reader, wherever one is shown. */
export const SDLC_LABELS: Record<SdlcPhase, string> = {
  PLANNING: "Planning",
  REQUIREMENTS_ANALYSIS: "Requirements analysis",
  DESIGN: "Design",
  DEVELOPMENT: "Development",
  TESTING: "Testing",
  DEPLOYMENT: "Deployment",
  MAINTENANCE: "Maintenance",
};

/** Values of the backend `ProblemStatus` enum. */
export const PROBLEM_STATUSES = [
  "DRAFT",
  "PENDING_APPROVAL",
  "PUBLISHED",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
] as const;

export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];

/**
 * Mirrors `ProblemModerationRequest`. The whole body is the status a moderator
 * moves the problem to — `PUBLISHED` to approve, `REJECTED` to turn away.
 *
 * Unlike a showcase decision there is no reason field upstream, so nothing a
 * reviewer types here could reach the author.
 */
export const problemModerationSchema = z.object({
  status: z.enum(PROBLEM_STATUSES, {
    message: `status must be one of ${PROBLEM_STATUSES.join(", ")}`,
  }),
});

/** Validated body sent to `PATCH /api/v1/admin/problems/{id}/moderation`. */
export type ProblemModerationRequest = z.output<
  typeof problemModerationSchema
>;

/** Mirrors `ProblemTechnologyRequest`. Only `name` is required upstream. */
export const problemTechnologySchema = z.object({
  name: z
    .string()
    .max(100, "Technology name must not exceed 100 characters"),
  version: z
    .string()
    .max(50, "Technology version must not exceed 50 characters")
    .optional(),
});

export type ProblemTechnologyRequest = z.output<
  typeof problemTechnologySchema
>;

const uniqueStrings = (values: string[]) =>
  new Set(values).size === values.length;

/**
 * Mirrors the backend `CreateProblemRequest` wire contract. The OpenAPI
 * document requires only `title`; every other field deliberately remains
 * optional here so proxy validation cannot reject a valid backend payload.
 */
export const problemCreateSchema = z.object({
  categoryId: z.uuid("Category id must be a UUID").optional(),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(180, "Title must not exceed 180 characters"),
  sdlcPhase: z
    .enum(SDLC_PHASES, {
      message: `sdlcPhase must be one of ${SDLC_PHASES.join(", ")}`,
    })
    .optional(),
  description: z
    .string()
    .max(20_000, "Description must not exceed 20000 characters")
    .optional(),
  technologies: z
    .array(problemTechnologySchema)
    .max(20, "Up to 20 technologies are allowed")
    .optional(),
  tagIds: z
    .array(z.uuid("Each tag id must be a UUID"))
    .max(10, "Up to 10 tag ids are allowed")
    .refine(uniqueStrings, { message: "Tag ids must be unique" })
    .optional(),
  tags: z
    .array(z.string().max(50, "Each tag must not exceed 50 characters"))
    .max(10, "Up to 10 tags are allowed")
    .refine(uniqueStrings, { message: "Tags must be unique" })
    .optional(),
});

/** Raw values accepted by the wire schema. */
export type CreateProblemInput = z.input<typeof problemCreateSchema>;

/** Validated request body sent to `POST /api/v1/problems`. */
export type CreateProblemRequest = z.output<typeof problemCreateSchema>;

const problemTechnologyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Technology name is required")
    .max(100, "Technology name must not exceed 100 characters"),
  version: z
    .string()
    .trim()
    .max(50, "Technology version must not exceed 50 characters")
    .optional(),
});

/**
 * Form-level rules can be stricter than the wire contract. A useful problem
 * post needs a substantive description, while the API still permits clients
 * to omit it from `CreateProblemRequest`.
 */
export const createProblemFormSchema = problemCreateSchema.extend({
  title: z
    .string()
    .trim()
    .min(10, "Title must be at least 10 characters")
    .max(180, "Title must not exceed 180 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(20_000, "Description must not exceed 20000 characters"),
  technologies: z
    .array(problemTechnologyFormSchema)
    .max(20, "Up to 20 technologies are allowed")
    .optional(),
});

export type CreateProblemFormInput = z.input<
  typeof createProblemFormSchema
>;
export type CreateProblemFormValues = z.output<
  typeof createProblemFormSchema
>;
