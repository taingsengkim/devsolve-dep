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
     * PUT /api/v1/votes/{type}/{targetId} sets the caller's vote rather than
     * adding one, so sending the same value twice is a no-op upstream.
     */
    setVote: builder.mutation<unknown, VoteTarget & { value: 1 | -1 }>({
      query: ({ type, targetId, value }) => ({
        url: `/votes/${type}/${targetId}`,
        method: "PUT",
        body: { value },
      }),
      async onQueryStarted(
        { type, targetId, value },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          votesApi.util.updateQueryData(
            "getVoteSummary",
            { type, targetId },
            (draft) => {
              const previousVote = draft.currentUserVote ?? 0;
              if (previousVote === value) return;

              draft.score += value - previousVote;

              if (previousVote === 1) {
                draft.upvotes = Math.max(0, draft.upvotes - 1);
              } else if (previousVote === -1) {
                draft.downvotes = Math.max(0, draft.downvotes - 1);
              }

              if (value === 1) {
                draft.upvotes += 1;
              } else {
                draft.downvotes += 1;
              }

              draft.currentUserVote = value;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (_result, _error, { type, targetId }) => [
        tagFor(type, targetId),
      ],
    }),

    /** DELETE /api/v1/votes/{type}/{targetId} withdraws it. */
    removeVote: builder.mutation<void, VoteTarget>({
      query: ({ type, targetId }) => ({
        url: `/votes/${type}/${targetId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ type, targetId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          votesApi.util.updateQueryData(
            "getVoteSummary",
            { type, targetId },
            (draft) => {
              const previousVote = draft.currentUserVote ?? 0;
              if (previousVote === 0) return;

              draft.score -= previousVote;

              if (previousVote === 1) {
                draft.upvotes = Math.max(0, draft.upvotes - 1);
              } else if (previousVote === -1) {
                draft.downvotes = Math.max(0, draft.downvotes - 1);
              }

              draft.currentUserVote = null;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
