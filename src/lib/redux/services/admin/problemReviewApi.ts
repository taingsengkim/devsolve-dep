import { baseApi } from "../baseApi";
import type { ProblemResponse } from "../problemsApi";
import type { Page } from "../showcasesApi";
import type {
  ProblemModerationRequest,
  ProblemStatus,
} from "@/lib/validations/problem";

/**
 * The moderation side of problems: the queue, and the decision on one entry.
 *
 * Kept apart from `problemsApi` because these routes are role-gated upstream —
 * a signed-in author hitting them gets a 403 — and because the rows here are
 * problems in states the public index never serves.
 */

export interface ProblemReviewQueueParams {
  /** Omitted upstream means every status, so the queue names its own. */
  status?: ProblemStatus;
  /** Zero-based, matching Spring's own paging on this controller. */
  page?: number;
  size?: number;
  /** `property,(asc|desc)` — defaults to `createdAt,ASC` upstream. */
  sort?: string;
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

export const problemReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/v1/admin/problems — problems awaiting a decision. */
    getProblemReviewQueue: builder.query<
      Page<ProblemResponse>,
      ProblemReviewQueueParams | void
    >({
      query: (args) => ({
        url: "/admin/problems",
        params: params(args ?? {}),
      }),
      providesTags: [{ type: "ProblemReview", id: QUEUE }],
    }),

    /**
     * PATCH /api/v1/admin/problems/{id}/moderation.
     *
     * Publishing changes what the public problem feed serves, so the
     * discussion list is invalidated alongside the queue.
     */
    updateProblemModeration: builder.mutation<
      ProblemResponse,
      { id: string; body: ProblemModerationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/problems/${id}/moderation`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ProblemReview", id },
        { type: "ProblemReview", id: QUEUE },
        { type: "Problem", id },
        { type: "Discussion", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProblemReviewQueueQuery,
  useUpdateProblemModerationMutation,
} = problemReviewApi;
