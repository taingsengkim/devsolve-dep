import * as z from "zod";

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
    .max(5000, "A comment must not exceed 5000 characters"),
  parentCommentId: z.uuid("parentCommentId must be a UUID").optional(),
  internal: z.boolean().optional(),
});
