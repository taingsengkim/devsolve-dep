import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";
import type { CommentableType } from "@/lib/validations/engagement";

/** `CommentResponse`. */
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
  createdAt: string;
  updatedAt?: string;
}

interface CommentThreadParams {
  commentableType: CommentableType;
  commentableId: string;
  parentCommentId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateCommentRequest {
  commentableType: CommentableType;
  commentableId: string;
  content: string;
  parentCommentId?: string;
}

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
    /** GET /api/v1/comments — one target's thread, oldest page first. */
    getComments: builder.query<Page<CommentResponse>, CommentThreadParams>({
      query: (args) => ({ url: "/comments", params: params(args) }),
      providesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),

    /** POST /api/v1/comments. */
    createComment: builder.mutation<CommentResponse, CreateCommentRequest>({
      query: (body) => ({ url: "/comments", method: "POST", body }),
      invalidatesTags: (_result, _error, { commentableType, commentableId }) => [
        tagFor(commentableType, commentableId),
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentsApi;
