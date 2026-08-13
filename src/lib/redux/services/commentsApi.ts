import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";
import type {
  CommentableType,
  CommentSort,
} from "@/lib/validations/engagement";
import {
  buildCreateCommentBody,
  type CreateCommentInput,
} from "@/lib/comments/payload";

/**
 * `CommentResponse` in full.
 *
 * The half of this the UI used to declare was the half that describes who said
 * what. The rest is what makes a thread usable: the permission flags that say
 * whether the reader may revise or withdraw a comment, the vote tallies, the
 * edit marker, and the soft-delete state that keeps a removed comment in place
 * so its replies keep their parent.
 */
export interface CommentResponse {
  id: string;
  commentableType: CommentableType;
  commentableId: string;
  parentCommentId?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  internal?: boolean;
  replyCount?: number;
  voteScore?: number;
  upvoteCount?: number;
  downvoteCount?: number;
  /** 1, -1, or 0/absent when the reader has not voted. */
  myVote?: number;
  edited?: boolean;
  editedAt?: string;
  /** Soft-deleted. The row stays so replies keep a parent. */
  removed?: boolean;
  removalReason?: "AUTHOR" | "MODERATOR";
  canEdit?: boolean;
  canDelete?: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** `CommentThreadResponse` — one top-level comment with its first replies. */
export interface CommentThreadResponse {
  comment: CommentResponse;
  replies: CommentResponse[];
  replyCount: number;
  hasMoreReplies: boolean;
}

interface CommentTarget {
  commentableType: CommentableType;
  commentableId: string;
}

interface CommentThreadParams extends CommentTarget {
  sort?: CommentSort;
  /** Replies attached to each parent, 0–10. */
  replyLimit?: number;
  pageNumber?: number;
  pageSize?: number;
}

interface CommentListParams extends CommentTarget {
  parentCommentId?: string;
  sort?: CommentSort;
  pageNumber?: number;
  pageSize?: number;
}

export type { CreateCommentBody } from "@/lib/comments/payload";

/**
 * What a caller passes to `createComment`. The body that actually goes over
 * the wire is `buildCreateCommentBody`'s, which fills in every field the
 * backend binds — see that module for why the optional ones are not optional
 * in practice.
 */
export type CreateCommentRequest = CreateCommentInput;

/** Drops undefined entries so RTK Query's cache keys stay stable. */
function params(source: object): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined && value !== "") out[key] = String(value);
  }
  return out;
}

/** One cache entry per thread, keyed by what the comments hang off. */
const tagFor = (type: CommentableType, id: string) =>
  ({ type: "Comment" as const, id: `${type}-${id}` });

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/v1/comments/thread — the whole visible thread in one request.
     *
     * Preferred over `getComments` for rendering: building the same nesting
     * from the flat collection costs one request per parent.
     */
    getCommentThread: builder.query<
      Page<CommentThreadResponse>,
      CommentThreadParams
    >({
      query: (args) => ({ url: "/comments/thread", params: params(args) }),
      providesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),

    /**
     * GET /api/v1/comments — the flat collection. Used to pull the replies a
     * thread page left behind, by passing the parent's id.
     */
    getComments: builder.query<Page<CommentResponse>, CommentListParams>({
      query: (args) => ({ url: "/comments", params: params(args) }),
      providesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),

    /**
     * POST /api/v1/comments — a new comment, or a reply with a parent id.
     *
     * The input is normalised into the complete body first; RTK Query then
     * serialises it and sets `Content-Type: application/json`.
     */
    createComment: builder.mutation<CommentResponse, CreateCommentRequest>({
      query: (input) => ({
        url: "/comments",
        method: "POST",
        body: buildCreateCommentBody(input),
      }),
      invalidatesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),

    /** PATCH /api/v1/comments/{id}. */
    updateComment: builder.mutation<
      CommentResponse,
      CommentTarget & { id: string; content: string }
    >({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),

    /** DELETE /api/v1/comments/{id} — soft, so replies keep their parent. */
    deleteComment: builder.mutation<void, CommentTarget & { id: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentThreadQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
