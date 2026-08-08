import { baseApi } from "../baseApi";
import type {
  Page,
  ShowcaseReviewDetailResponse,
} from "../showcasesApi";
import type { ShowcaseReviewStatus } from "@/lib/validations/showcase";

/**
 * The moderation side of showcases: the queue, one submission in full, the
 * decision, and the trail of past decisions.
 *
 * Kept apart from `showcasesApi` because these routes are role-gated upstream
 * — a signed-in author hitting them gets a 403 — and because the queue row is
 * a submission rather than a showcase.
 */

/** `ShowcaseReviewQueueItemResponse` — a queue row, without steps. */
export interface ShowcaseReviewQueueItem {
  showcaseId: string;
  revisionId?: string;
  submissionType: "INITIAL" | "REVISION";
  authorId: string;
  authorName: string;
  categoryId?: string;
  categoryName?: string;
  title: string;
  overview: string;
  coverImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  reviewStatus: ShowcaseReviewStatus;
  submittedAt: string;
}

/** `ShowcaseReviewHistoryResponse` — one past decision. */
export interface ShowcaseReviewHistoryEntry {
  id: string;
  showcaseId: string;
  revisionId?: string;
  submissionType: "INITIAL" | "REVISION";
  categoryId?: string;
  title: string;
  overview: string;
  coverImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  reviewStatus: ShowcaseReviewStatus;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

/** `UpdateShowcaseStatusRequest`. */
export interface ShowcaseReviewDecision {
  reviewStatus: ShowcaseReviewStatus;
  /** Shown to the author, and required by the proxy on a rejection. */
  rejectionReason?: string;
}

export interface ReviewQueueParams {
  /** Defaults to `PENDING` upstream — the queue proper. */
  reviewStatus?: ShowcaseReviewStatus;
  pageNumber?: number;
  pageSize?: number;
}

/** Drops undefined entries so RTK Query's cache keys stay stable. */
function params(source: object): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined && value !== "") out[key] = String(value);
  }
  return out;
}

const QUEUE = "QUEUE";

export const showcaseReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/v1/admin/showcases — submissions awaiting a decision. */
    getShowcaseReviewQueue: builder.query<
      Page<ShowcaseReviewQueueItem>,
      ReviewQueueParams | void
    >({
      query: (args) => ({
        url: "/admin/showcases",
        params: params(args ?? {}),
      }),
      providesTags: [{ type: "ShowcaseReview", id: QUEUE }],
    }),

    /** GET /api/v1/admin/showcases/{id} — the submission in full, with steps. */
    getShowcaseReviewDetail: builder.query<ShowcaseReviewDetailResponse, string>(
      {
        query: (id) => `/admin/showcases/${id}`,
        providesTags: (_result, _error, id) => [
          { type: "ShowcaseReview", id },
        ],
      },
    ),

    /** GET /api/v1/admin/showcases/{id}/review-history. */
    getShowcaseReviewHistory: builder.query<
      Page<ShowcaseReviewHistoryEntry>,
      { id: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ id, ...rest }) => ({
        url: `/admin/showcases/${id}/review-history`,
        params: params(rest),
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "ShowcaseReview", id: `HISTORY-${id}` },
      ],
    }),

    /**
     * PATCH /api/v1/admin/showcases/{id}/review-status.
     *
     * An approval changes what the public index serves, so the showcase caches
     * are invalidated alongside the review ones.
     */
    updateShowcaseReviewStatus: builder.mutation<
      ShowcaseReviewDetailResponse,
      { id: string; body: ShowcaseReviewDecision }
    >({
      query: ({ id, body }) => ({
        url: `/admin/showcases/${id}/review-status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ShowcaseReview", id },
        { type: "ShowcaseReview", id: QUEUE },
        { type: "ShowcaseReview", id: `HISTORY-${id}` },
        { type: "Showcase", id },
        { type: "Showcase", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetShowcaseReviewQueueQuery,
  useGetShowcaseReviewDetailQuery,
  useGetShowcaseReviewHistoryQuery,
  useUpdateShowcaseReviewStatusMutation,
} = showcaseReviewApi;
