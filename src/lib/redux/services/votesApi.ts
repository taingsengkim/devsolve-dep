import { baseApi } from "./baseApi";
import type { VoteTargetType } from "@/lib/validations/engagement";

/** `VoteSummaryResponse`. */
export interface VoteSummary {
  type: VoteTargetType;
  targetId: string;
  score: number;
  upvotes: number;
  downvotes: number;
  /** 1 or -1; null when the caller has not voted, or is signed out. */
  currentUserVote: number | null;
}

interface VoteTarget {
  type: VoteTargetType;
  targetId: string;
}

/** One cache entry per target, so two voted items never share a tag. */
const tagFor = (type: VoteTargetType, targetId: string) =>
  ({ type: "Vote" as const, id: `${type}-${targetId}` });

export const votesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/v1/votes/{type}/{targetId}/summary. */
    getVoteSummary: builder.query<VoteSummary, VoteTarget>({
      query: ({ type, targetId }) => `/votes/${type}/${targetId}/summary`,
      providesTags: (_result, _error, { type, targetId }) => [
        tagFor(type, targetId),
      ],
    }),

    /**
     * PUT /api/v1/votes/{type}/{targetId} — sets the caller's vote rather than
     * adding one, so sending the same value twice is a no-op upstream.
     */
    setVote: builder.mutation<unknown, VoteTarget & { value: 1 | -1 }>({
      query: ({ type, targetId, value }) => ({
        url: `/votes/${type}/${targetId}`,
        method: "PUT",
        body: { value },
      }),
      invalidatesTags: (_result, _error, { type, targetId }) => [
        tagFor(type, targetId),
      ],
    }),

    /** DELETE /api/v1/votes/{type}/{targetId} — withdraws it. */
    removeVote: builder.mutation<void, VoteTarget>({
      query: ({ type, targetId }) => ({
        url: `/votes/${type}/${targetId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { type, targetId }) => [
        tagFor(type, targetId),
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetVoteSummaryQuery,
  useSetVoteMutation,
  useRemoveVoteMutation,
} = votesApi;
