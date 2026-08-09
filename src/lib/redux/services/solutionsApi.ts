import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";

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
  }),
  overrideExisting: true,
});

export const { useGetSolutionsByProblemQuery, useGetPublicProfileQuery } =
  solutionsApi;
