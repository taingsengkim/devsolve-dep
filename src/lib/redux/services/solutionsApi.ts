import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";
import type { CreateSolutionRequest } from "@/lib/validations/solution";

/**
 * Answers on a problem — `GET /api/v1/problems/{problemId}/solutions`.
 *
 * The response names its author by id only, so anything that wants a name
 * resolves it through `/user-profiles/{userId}`.
 */

/** `SolutionResponse`. */
export interface SolutionResponse {
  id: string;
  problemId: string;
  authorId: string;
  description: string;
  videoUrl?: string;
  diagramUrl?: string;
  reviewStatus?: "PENDING" | "APPROVED" | "REJECTED" | "ACCEPTED";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

/** `PublicUserProfileResponse`, trimmed to what an author line needs. */
export interface PublicProfileSummary {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  biography?: string;
  reputation?: number;
}

export const solutionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSolutionsByProblem: builder.query<
      Page<SolutionResponse>,
      { problemId: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ problemId, pageNumber, pageSize }) => {
        const params: Record<string, string> = {};
        if (pageNumber !== undefined) params.pageNumber = String(pageNumber);
        if (pageSize !== undefined) params.pageSize = String(pageSize);
        return { url: `/problems/${problemId}/solutions`, params };
      },
      providesTags: (_result, _error, { problemId }) => [
        { type: "Solution", id: problemId },
      ],
    }),

    /** GET /api/user-profiles/{userId} — an author's public profile. */
    getPublicProfile: builder.query<PublicProfileSummary, string>({
      query: (userId) => `/user-profiles/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
      ],
    }),

    /**
     * GET /api/user-profiles/me — the caller's own id as the backend knows it.
     *
     * `author.id` on a problem is that same id, so this is what tells the page
     * whether the reader is looking at their own post.
     */
    getMyProfile: builder.query<PublicProfileSummary, void>({
      query: () => "/user-profiles/me",
      providesTags: [{ type: "Profile", id: "ME" }],
    }),

    /**
     * POST /api/v1/problems/{problemId}/solutions.
     *
     * Invalidates the problem's answer list so a freshly posted solution shows
     * up without a reload.
     */
    createSolution: builder.mutation<
      SolutionResponse,
      { problemId: string; body: CreateSolutionRequest }
    >({
      query: ({ problemId, body }) => ({
        url: `/problems/${problemId}/solutions`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { problemId }) => [
        { type: "Solution", id: problemId },
        { type: "Solution", id: "MINE" },
        { type: "Problem", id: problemId },
      ],
    }),

    /**
     * DELETE /api/solutions/{id} — the author withdrawing their own answer.
     *
     * The problem it answered is invalidated alongside the author's own list,
     * so the count under that problem drops without a reload. `problemId` is
     * optional because the caller does not always know it.
     */
    deleteSolution: builder.mutation<void, { id: string; problemId?: string }>({
      query: ({ id }) => ({ url: `/solutions/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { problemId }) => [
        { type: "Solution", id: "MINE" },
        ...(problemId
          ? [
              { type: "Solution" as const, id: problemId },
              { type: "Problem" as const, id: problemId },
            ]
          : []),
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSolutionsByProblemQuery,
  useGetPublicProfileQuery,
  useGetMyProfileQuery,
  useCreateSolutionMutation,
  useDeleteSolutionMutation,
} = solutionsApi;
