import * as z from "zod";
import { isCleanText, profanityMessage } from "@/lib/moderation/profanity";

/* ─── URL handling ──────────────────────────────────────────────────────
   Authors type `github.com/me/repo` far more often than they type the
   scheme. Rather than rejecting that, the schema normalises to https:// and
   validates the result, so the value stored is always a real absolute URL. */

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** The host shown back to the author as a chip, so a typo is visible. */
export function hostOf(raw: string): string | null {
  const normalized = normalizeUrl(raw);
  if (!normalized) return null;
  try {
    return new URL(normalized).host || null;
  } catch {
    return null;
  }
}

/** Optional URL field: blank stays blank, anything else must resolve. */
const optionalUrl = (max = 500) =>
  z
    .string()
    .trim()
    .transform(normalizeUrl)
    .refine((value) => value === "" || URL.canParse(value), {
      message: "Enter a valid URL",
    })
    .refine((value) => value.length <= max, {
      message: `URL must not exceed ${max} characters`,
    })
    .optional();

/* ─── Tech stack ────────────────────────────────────────────────────────
   The showcase_tech table carries a unique constraint per showcase, so two
   spellings of the same thing collide server-side. Canonical casing is
   applied on entry rather than at submit, which keeps the chips honest
   about what will be stored. */

/** Known technologies, used both for autocomplete and to fix casing. */
export const TECH_SUGGESTIONS = [
  "React",
  "Next.js",
  "Vue.js",
  "Svelte",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "NestJS",
  "Java",
  "Spring Boot",
  "Kotlin",
  "Python",
  "FastAPI",
  "Django",
  "Go",
  "Rust",
  "PHP",
  "Laravel",
  "Ruby on Rails",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Prisma",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Google Cloud",
  "Azure",
  "Vercel",
  "Firebase",
  "Supabase",
  "Flutter",
  "React Native",
  "Swift",
  "Terraform",
] as const;

/** `reactjs` and `REACT` both become `React`; unknown values keep their shape. */
export function canonicalizeTech(raw: string): string {
  const cleaned = raw.trim().replace(/^#/, "").replace(/\s+/g, " ");
  if (!cleaned) return "";

  const key = cleaned.toLowerCase().replace(/[.\s-]/g, "");
  const known = TECH_SUGGESTIONS.find(
    (tech) => tech.toLowerCase().replace(/[.\s-]/g, "") === key,
  );
  if (known) return known;

  // Common suffix authors add that the canonical name doesn't carry.
  const withoutJs = key.replace(/js$/, "");
  const nearby = TECH_SUGGESTIONS.find(
    (tech) => tech.toLowerCase().replace(/[.\s-]/g, "") === withoutJs,
  );

  return nearby ?? cleaned;
}

export const MAX_TECH = 15;

/* ─── Pending images ────────────────────────────────────────────────────
   Every image route the backend publishes is scoped to a row that must
   already exist — `PUT /showcases/{id}/cover-image`, `PUT
   /showcase-steps/{showcaseId}/{stepId}/image`. A file chosen while writing
   therefore waits in form state and is uploaded right after the row it
   belongs to is created. Authors who paste a URL instead skip that entirely
   and the matching `*Url` field carries the value. */

const pendingImage = z
  .custom<File>((value) => value instanceof File, {
    message: "Choose a PNG, JPG, or WebP image",
  })
  .optional();

/* ─── Build steps ───────────────────────────────────────────────────────
   `stepNumber` is deliberately absent: it comes from list position at
   submit time, so reordering or deleting can never leave a gap. */

export const buildStepSchema = z.object({
  /** Client-side only — React key and collapse state, never sent. */
  key: z.string(),
  /**
   * The step's id upstream, set only on steps loaded for editing. Its absence
   * is what marks a step as new, and what tells the save sequence to POST it
   * rather than PATCH it.
   */
  serverId: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Step title is required")
    .max(255, "Step title must not exceed 255 characters"),
  description: z.string().trim().min(1, "Step description is required"),
  codeSnippet: z.string().optional(),
  /** Highlighting hint for the editor — the API has no column for it. */
  codeLanguage: z.string().optional(),
  imageUrl: z
    .string()
    .trim()
    .max(500, "Image URL must not exceed 500 characters")
    .optional(),
  diagramUrl: z
    .string()
    .trim()
    .max(500, "Diagram URL must not exceed 500 characters")
    .optional(),
  /** Uploaded to the step's `/image` route once the step exists. */
  imageFile: pendingImage,
  /** Uploaded to the step's `/diagram` route once the step exists. */
  diagramFile: pendingImage,
});

export type BuildStepValues = z.infer<typeof buildStepSchema>;

/* ─── Resource links ────────────────────────────────────────────────────
   Label + URL pairs (Figma, API docs, Postman). No uploads, so nothing here
   needs a moderation surface. */

export const resourceLinkSchema = z.object({
  key: z.string(),
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(80, "Label must not exceed 80 characters"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .transform(normalizeUrl)
    .refine((value) => URL.canParse(value), { message: "Enter a valid URL" })
    .refine((value) => value.length <= 500, {
      message: "URL must not exceed 500 characters",
    }),
});

export type ResourceLinkValues = z.infer<typeof resourceLinkSchema>;

/* ─── The form ──────────────────────────────────────────────────────── */

export const createShowcaseSchema = z
  .object({
    coverImageUrl: z
      .string()
      .trim()
      .max(500, "Cover image URL must not exceed 500 characters")
      .optional(),
    /** Uploaded to `/showcases/{id}/cover-image` once the showcase exists. */
    coverImageFile: pendingImage,
    title: z
      .string()
      .trim()
      .min(1, "Project title is required")
      .max(255, "Title must not exceed 255 characters")
      .refine(isCleanText, profanityMessage("Title")),
    categoryId: z.string().min(1, "Pick a category"),
    overview: z
      .string()
      .trim()
      .min(1, "An overview is required")
      .refine(isCleanText, profanityMessage("The overview")),
    techStack: z
      .array(z.string())
      .max(MAX_TECH, `Up to ${MAX_TECH} technologies`),
    steps: z.array(buildStepSchema).min(1, "Add at least one build step"),
    repoUrl: optionalUrl(),
    liveUrl: optionalUrl(),
    videoUrl: optionalUrl(),
    resourceLinks: z.array(resourceLinkSchema),
  })
  /* A cover can arrive either way, so the requirement is on the pair rather
     than on one field. The message is reported against `coverImageUrl`, which
     is where the field renders its error. */
  .refine(
    (values) => Boolean(values.coverImageUrl?.trim() || values.coverImageFile),
    { message: "A cover image is required", path: ["coverImageUrl"] },
  );

/** What the fields hold while editing — before zod's URL transforms run. */
export type CreateShowcaseFormValues = z.input<typeof createShowcaseSchema>;

/** What `handleSubmit` hands back, with every URL normalised. */
export type CreateShowcaseSubmitValues = z.output<typeof createShowcaseSchema>;

/* ─── Wire schemas ──────────────────────────────────────────────────────
   What the proxy routes under `src/app/api/showcases` and
   `src/app/api/showcase-steps` validate before relaying. These mirror the
   backend request bodies field for field, with no URL normalising: by the
   time a value reaches a route the client has already resolved it, and
   rewriting it here would hide what was actually sent. */

export const SHOWCASE_REVIEW_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export type ShowcaseReviewStatus = (typeof SHOWCASE_REVIEW_STATUSES)[number];

/** Optional string field capped the way the backend caps it. */
const wireText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must not exceed ${max} characters`)
    .optional();

/** Mirrors `CreateShowCasesRequest` — `title` and `overview` are required. */
export const showcaseCreateSchema = z.object({
  categoryId: z.uuid("Category id must be a UUID").optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  overview: z.string().trim().min(1, "An overview is required"),
  coverImageUrl: wireText(500, "Cover image URL"),
  liveUrl: wireText(500, "Live URL"),
  repoUrl: wireText(500, "Repository URL"),
  videoUrl: wireText(500, "Video URL"),
});

/** Mirrors `UpdateShowCasesRequest` — every field optional. */
export const showcaseUpdateSchema = showcaseCreateSchema.partial();

/** Mirrors `CreateShowcaseStepRequest`. */
export const showcaseStepCreateSchema = z.object({
  stepNumber: z.coerce
    .number()
    .int("Step number must be a whole number")
    .min(1, "Step numbers start at 1"),
  title: z
    .string()
    .trim()
    .min(1, "Step title is required")
    .max(255, "Step title must not exceed 255 characters"),
  description: z.string().trim().min(1, "Step description is required"),
  codeSnippet: z.string().optional(),
  imageUrl: wireText(500, "Image URL"),
  diagramUrl: wireText(500, "Diagram URL"),
});

/** Mirrors `UpdateShowcaseStepRequest` — every field optional. */
export const showcaseStepUpdateSchema = showcaseStepCreateSchema.partial();

/** Mirrors `UpdateShowcaseStatusRequest`, the admin review decision. */
export const showcaseReviewStatusSchema = z.object({
  reviewStatus: z.enum(SHOWCASE_REVIEW_STATUSES, {
    message: `reviewStatus must be one of ${SHOWCASE_REVIEW_STATUSES.join(", ")}`,
  }),
  rejectionReason: wireText(2000, "Rejection reason"),
});

/* ─── Cover image constraints ───────────────────────────────────────── */

export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const COVER_ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
export const COVER_ASPECT = 16 / 9;

/** Null when the file is acceptable, otherwise the reason it is not. */
export function validateImageFile(file: File): string | null {
  if (!COVER_ACCEPTED.includes(file.type)) {
    return "Only PNG, JPG, or WebP images are accepted";
  }
  if (file.size > COVER_MAX_BYTES) {
    return `Image must be 5MB or smaller (this one is ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }
  return null;
}
