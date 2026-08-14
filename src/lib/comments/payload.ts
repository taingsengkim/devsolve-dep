import type { CommentableType } from "@/lib/validations/engagement";

/**
 * The body `POST /api/v1/comments` expects.
 *
 * Every field is sent on every submission, including the ones the OpenAPI
 * document marks optional. `internal` is the reason: the backend binds it to a
 * non-nullable boolean, so a payload that leaves it out fails to deserialize
 * and Spring reports that as `HttpMessageNotReadableException` — surfacing to
 * the client as "The request body is missing or is not valid JSON", which
 * reads like the body never arrived rather than like a field is missing.
 *
 * `parentCommentId` is explicitly `null` rather than absent, and
 * `mentionedUserIds` an empty array rather than absent, so the shape on the
 * wire is identical for a top-level comment and a reply.
 */
export interface CreateCommentBody {
  commentableType: CommentableType;
  commentableId: string;
  content: string;
  parentCommentId: string | null;
  internal: boolean;
  mentionedUserIds: string[];
}

/** What a caller supplies; the rest is filled in. */
export interface CreateCommentInput {
  commentableType: CommentableType;
  commentableId: string;
  content: string;
  parentCommentId?: string | null;
  /** Team-only note. Public comments are `false`, which is the default. */
  internal?: boolean;
  mentionedUserIds?: string[];
}

/**
 * Normalises a submission into the full body.
 *
 * The single place the wire shape is decided, so a reply cannot drift from a
 * top-level comment and no call site can forget a field.
 */
export function buildCreateCommentBody(
  input: CreateCommentInput,
): CreateCommentBody {
  return {
    /* The backend enum is uppercase; anything else is rejected. */
    commentableType: input.commentableType,
    commentableId: input.commentableId,
    content: input.content,
    parentCommentId: input.parentCommentId ?? null,
    internal: input.internal ?? false,
    mentionedUserIds: input.mentionedUserIds ?? [],
  };
}
