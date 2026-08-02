import { baseApi } from "./baseApi";
import {
  DiscussionPost,
  TopicCount,
} from "@/lib/types/dicussion/types";
import {
  MOCK_DISCUSSIONS,
  MOCK_TOPICS,
  MOCK_TRENDING_TAGS,
} from "@/lib/types/dicussion/discussionMockData";

// ─── Query param types ────────────────────────────────────────────────────────

export interface DiscussionsFilterParams {
  category?: "All" | "Problems" | "Showcase";
  topic?: string | null;
  tag?: string | null;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface DiscussionsResponse {
  data: DiscussionPost[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DiscussionStats {
  problems: number;
  solutions: number;
  researchers: number;
}

// ─── Mock vote state (module-level, real API will replace this) ───────────────
const votesMap: Record<string, { votes: number; isUpvoted: boolean }> = {};
const bookmarksSet = new Set<string>();

MOCK_DISCUSSIONS.forEach((d) => {
  votesMap[d.id] = { votes: d.votes, isUpvoted: d.isUpvoted ?? false };
  if (d.isBookmarked) bookmarksSet.add(d.id);
});

// ─── API slice ────────────────────────────────────────────────────────────────

export const discussionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── List discussions with filter + pagination ───────────────────────────
    getDiscussions: builder.query<DiscussionsResponse, DiscussionsFilterParams | void>({
      queryFn: (params) => {
        let results = MOCK_DISCUSSIONS.map((d) => ({
          ...d,
          votes: votesMap[d.id]?.votes ?? d.votes,
          isUpvoted: votesMap[d.id]?.isUpvoted ?? false,
          isBookmarked: bookmarksSet.has(d.id),
        }));

        if (params?.category && params.category !== "All") {
          results = results.filter((d) => d.category === params.category);
        }
        if (params?.topic) {
          results = results.filter((d) => d.topic === params.topic);
        }
        if (params?.tag) {
          results = results.filter((d) => d.tags.includes(params.tag!));
        }
        if (params?.searchQuery?.trim()) {
          const q = params.searchQuery.toLowerCase();
          results = results.filter(
            (d) =>
              d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        const limit = params?.limit ?? 10;
        const page = params?.page ?? 1;
        const totalCount = results.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        const start = (page - 1) * limit;
        const paginatedData = results.slice(start, start + limit);

        return {
          data: { data: paginatedData, totalCount, page, limit, totalPages },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Discussion" as const, id })),
              { type: "Discussion" as const, id: "LIST" },
            ]
          : [{ type: "Discussion" as const, id: "LIST" }],
    }),

    // ── Fetch single discussion ─────────────────────────────────────────────
    getDiscussionById: builder.query<DiscussionPost | null, string>({
      queryFn: (id) => {
        const found = MOCK_DISCUSSIONS.find((d) => d.id === id);
        if (!found) return { data: null };
        return {
          data: {
            ...found,
            votes: votesMap[id]?.votes ?? found.votes,
            isUpvoted: votesMap[id]?.isUpvoted ?? false,
            isBookmarked: bookmarksSet.has(id),
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: "Discussion" as const, id }],
    }),

    // ── Topic list ──────────────────────────────────────────────────────────
    getDiscussionTopics: builder.query<TopicCount[], void>({
      queryFn: () => ({ data: MOCK_TOPICS }),
      providesTags: [{ type: "Discussion" as const, id: "TOPICS" }],
    }),

    // ── Trending tags ───────────────────────────────────────────────────────
    getTrendingTags: builder.query<string[], void>({
      queryFn: () => ({ data: MOCK_TRENDING_TAGS }),
      providesTags: [{ type: "Discussion" as const, id: "TAGS" }],
    }),

    // ── Platform stats ──────────────────────────────────────────────────────
    getDiscussionStats: builder.query<DiscussionStats, void>({
      queryFn: () => ({
        data: { problems: 847, solutions: 3241, researchers: 12480 },
      }),
      providesTags: [{ type: "Discussion" as const, id: "STATS" }],
    }),

    // ── Vote mutation ───────────────────────────────────────────────────────
    voteDiscussion: builder.mutation<
      { id: string; votes: number; isUpvoted: boolean },
      { id: string }
    >({
      queryFn: ({ id }) => {
        const current = votesMap[id];
        if (!current) return { error: { status: 404, data: "Not found" } };
        if (current.isUpvoted) {
          current.votes -= 1;
          current.isUpvoted = false;
        } else {
          current.votes += 1;
          current.isUpvoted = true;
        }
        return { data: { id, votes: current.votes, isUpvoted: current.isUpvoted } };
      },
      // TODO: replace queryFn with query() when real API is ready
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Discussion" as const, id },
        { type: "Discussion" as const, id: "LIST" },
      ],
    }),

    // ── Bookmark mutation ───────────────────────────────────────────────────
    bookmarkDiscussion: builder.mutation<
      { id: string; isBookmarked: boolean },
      { id: string }
    >({
      queryFn: ({ id }) => {
        const wasBookmarked = bookmarksSet.has(id);
        if (wasBookmarked) bookmarksSet.delete(id);
        else bookmarksSet.add(id);
        return { data: { id, isBookmarked: !wasBookmarked } };
      },
      // TODO: replace queryFn with query() when real API is ready
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Discussion" as const, id },
        { type: "Discussion" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDiscussionsQuery,
  useGetDiscussionByIdQuery,
  useGetDiscussionTopicsQuery,
  useGetTrendingTagsQuery,
  useGetDiscussionStatsQuery,
  useVoteDiscussionMutation,
  useBookmarkDiscussionMutation,
} = discussionsApi;
