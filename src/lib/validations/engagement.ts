import * as z from "zod";
import { isCleanText, profanityMessage } from "@/lib/moderation/profanity";

/**
 * Votes and comments hang off several kinds of content, so their schemas live
 * together here rather than under any one feature.
 */

export const VOTE_TARGET_TYPES = [
  "PROBLEM",
  "SOLUTION",
  "COMMENT",
  "SHOWCASE",
] as const;

export type VoteTargetType = (typeof VOTE_TARGET_TYPES)[number];

/** What can be bookmarked. A comment cannot; a program can. */
export const BOOKMARK_TARGET_TYPES = [
  "PROGRAM",
  "PROBLEM",
  "SOLUTION",
  "SHOWCASE",
] as const;

export type BookmarkTargetType = (typeof BOOKMARK_TARGET_TYPES)[number];

export const COMMENTABLE_TYPES = [
  "REPORT",
  "SOLUTION",
  "PROGRAM",
  "PROBLEM",
  "SHOWCASE",
] as const;

export type CommentableType = (typeof COMMENTABLE_TYPES)[number];

/**
 * Mirrors `VoteRequest`. The backend types `value` as a plain int; only an
 * up- or downvote is meaningful, so anything else is rejected here rather than
 * stored as a score nobody can undo through the UI.
 */
export const voteRequestSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)], {
    message: "value must be 1 (upvote) or -1 (downvote)",
  }),
});

/** Mirrors `CreateCommentRequest`. */
export const commentCreateSchema = z.object({
  commentableType: z.enum(COMMENTABLE_TYPES, {
    message: `commentableType must be one of ${COMMENTABLE_TYPES.join(", ")}`,
  }),
  commentableId: z.uuid("commentableId must be a UUID"),
  content: z
    .string()
    .trim()
    .min(1, "A comment cannot be empty")
    .max(5000, "A comment must not exceed 5000 characters")
    .refine(isCleanText, profanityMessage("Your comment")),
  /* Defaulted rather than optional so `parsed.data` — which is what the proxy
     forwards — always carries every field the backend binds. Omitting
     `internal` makes its non-nullable boolean fail to deserialize, and Spring
     reports that as a missing or malformed body. */
  parentCommentId: z
    .uuid("parentCommentId must be a UUID")
    .nullable()
    .default(null),
  internal: z.boolean().default(false),
  mentionedUserIds: z.array(z.uuid()).default([]),
});

/** Mirrors `UpdateCommentRequest` — the body is the only editable field. */
export const commentUpdateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "A comment cannot be empty")
    .max(5000, "A comment must not exceed 5000 characters")
    .refine(isCleanText, profanityMessage("Your comment")),
});

/** How `/comments/thread` and `/comments` order a page. */
export const COMMENT_SORTS = ["NEWEST", "OLDEST", "TOP"] as const;

export type CommentSort = (typeof COMMENT_SORTS)[number];

/** What a reader can report. Mirrors `CreateFlagRequest.flaggableType`. */
export const FLAGGABLE_TYPES = [
  "PROBLEM",
  "SOLUTION",
  "COMMENT",
  "SHOWCASE",
] as const;

export type FlaggableType = (typeof FLAGGABLE_TYPES)[number];

export const FLAG_REASONS = [
  "SPAM",
  "OFFENSIVE",
  "DUPLICATE",
  "OFF_TOPIC",
  "OTHER",
] as const;

export type FlagReason = (typeof FLAG_REASONS)[number];

/** Mirrors `CreateFlagRequest`. */
export const flagCreateSchema = z.object({
  flaggableType: z.enum(FLAGGABLE_TYPES, {
    message: `flaggableType must be one of ${FLAGGABLE_TYPES.join(", ")}`,
  }),
  flaggableId: z.uuid("flaggableId must be a UUID"),
  reason: z.enum(FLAG_REASONS, {
    message: `reason must be one of ${FLAG_REASONS.join(", ")}`,
  }),
  description: z
    .string()
    .trim()
    .max(2000, "A description must not exceed 2000 characters")
    .optional(),
});
