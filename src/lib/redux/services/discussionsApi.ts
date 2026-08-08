import { baseApi } from "./baseApi";
import {
  DiscussionPost,
  DiscussionSort,
  TopicCount,
  TopicFilter,
} from "@/lib/types/dicussion/types";
import {
  MOCK_DISCUSSIONS,
  MOCK_TOPICS,
  MOCK_TRENDING_TAGS,
} from "@/lib/types/dicussion/discussionMockData";
import { excerptOf } from "@/lib/markdown-excerpt";
import type { Page, ShowcaseResponse } from "./showcasesApi";

// ─── Query param types ────────────────────────────────────────────────────────

export interface DiscussionsFilterParams {
  category?: "All" | "Problems" | "Showcase";
  topic?: string | null;
  tag?: string | null;
  searchQuery?: string;
  sort?: DiscussionSort;
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

// ─── Sorting helpers ──────────────────────────────────────────────────────────

/** `createdAt` is a display string ("Jun 12, 2025" / "Just now"). Unparsable
 *  values are treated as "now" so freshly created posts sort to the top. */
function createdAtTime(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function sortDiscussions<T extends DiscussionPost>(list: T[], sort: DiscussionSort): T[] {
  const sorted = [...list];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => createdAtTime(a.createdAt) - createdAtTime(b.createdAt));
    case "top":
      return sorted.sort((a, b) => b.votes - a.votes);
    case "discussed":
      return sorted.sort((a, b) => b.answersCount - a.answersCount);
    case "viewed":
      return sorted.sort((a, b) => b.viewsCount - a.viewsCount);
    case "newest":
    default:
      return sorted.sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt));
  }
}

// ─── Mock vote state (module-level, real API will replace this) ───────────────
const votesMap: Record<string, { votes: number; isUpvoted: boolean }> = {};
const bookmarksSet = new Set<string>();

MOCK_DISCUSSIONS.forEach((d) => {
  votesMap[d.id] = { votes: d.votes, isUpvoted: d.isUpvoted ?? false };
  if (d.isBookmarked) bookmarksSet.add(d.id);
});

// ─── Showcases (real API) ─────────────────────────────────────────────────────

/**
 * Showcases in this feed are real: they come from `GET /api/v1/showcases`
 * through the proxy, and only ones an admin has approved are returned. Problems
 * are still the mock store, so the two are merged and then run through the same
 * filter/sort/paginate below — one code path, whatever a post came from.
 *
 * The endpoint caps a page at 100. That is the ceiling on how many showcases
 * one feed page can draw from; server-side paging can replace this once
 * problems are real too and the merge goes away.
 */
const SHOWCASE_PAGE_SIZE = 100;

function showcaseDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** `ShowCasesResponse` in the shape this feed's card already renders. */
function showcaseToPost(showcase: ShowcaseResponse): DiscussionPost {
  return {
    id: showcase.id,
    title: showcase.title,
    category: "Showcase",
    // A showcase has a category, not one of the mock topics.
    topic: showcase.categoryName || "Showcase",
    description: excerptOf(showcase.overview ?? "", 240),
    // No tag or vote data on the showcase endpoints yet — an empty list renders
    // no chips rather than inventing any.
    tags: [],
    thumbnailUrl: showcase.coverImageUrl,
    votes: 0,
    answersCount: 0,
    viewsCount: showcase.viewCount ?? 0,
    author: { name: showcase.authorName || "Unknown", avatarUrl: "" },
    createdAt: showcaseDate(showcase.createdAt),
    isBookmarked: false,
    isUpvoted: false,
  };
}

// ─── API slice ────────────────────────────────────────────────────────────────

export const discussionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── List discussions with filter + pagination ───────────────────────────
    getDiscussions: builder.query<DiscussionsResponse, DiscussionsFilterParams | void>({
      queryFn: async (params, _api, _extraOptions, fetchWithBQ) => {
        const category = params?.category ?? "All";

        /* Showcases come from the API, problems from the mock store, and the
           category tab decides which halves are worth asking for. */
        let showcases: DiscussionPost[] = [];
        if (category !== "Problems") {
          const response = await fetchWithBQ({
            url: "/showcases",
            params: {
              pageSize: SHOWCASE_PAGE_SIZE,
              sortBy: "createdAt",
              sortDirection: "DESC",
              // Narrowing upstream keeps the search from being limited to
              // whatever the first page happened to contain.
              ...(params?.searchQuery?.trim()
                ? { query: params.searchQuery.trim() }
                : {}),
            },
          });

          if (response.error) return { error: response.error };

          const page = response.data as Page<ShowcaseResponse>;
          showcases = (page?.content ?? []).map(showcaseToPost);
        }

        const problems =
          category === "Showcase"
            ? []
            : MOCK_DISCUSSIONS.filter((d) => d.category === "Problems");

        let results = [...showcases, ...problems].map((d) => ({
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
              // Showcases were already matched upstream, against their full
              // overview rather than the excerpt held here — re-testing them
              // against the excerpt would drop genuine matches.
              d.category === "Showcase" ||
              d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        results = sortDiscussions(results, params?.sort ?? "newest");

        const limit = params?.limit ?? 10;
        const totalCount = results.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        // Clamp so a stale page (e.g. after narrowing filters) never yields a blank feed.
        const page = Math.min(Math.max(1, params?.page ?? 1), totalPages);
        const start = (page - 1) * limit;
        const paginatedData = results.slice(start, start + limit);

        return {
          data: { data: paginatedData, totalCount, page, limit, totalPages },
        };
      },
      /* Also tagged `Showcase/LIST`, so publishing or approving a showcase
         refreshes this feed the same way it refreshes the showcase caches. */
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Discussion" as const, id })),
              { type: "Discussion" as const, id: "LIST" },
              { type: "Showcase" as const, id: "LIST" },
            ]
          : [
              { type: "Discussion" as const, id: "LIST" },
              { type: "Showcase" as const, id: "LIST" },
            ],
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

    // ── Create discussion mutation ─────────────────────────────────────────
    createDiscussion: builder.mutation<
      DiscussionPost,
      {
        title: string;
        category: "Problems" | "Showcase";
        topic: TopicFilter;
        description: string;
        tags: string[];
        techStack?: string[];
        codeSnippet?: string;
        thumbnailUrl?: string;
      }
    >({
      queryFn: (newPost) => {
        const created: DiscussionPost = {
          id: `disc-${Date.now()}`,
          title: newPost.title,
          category: newPost.category,
          topic: newPost.topic,
          description: newPost.description,
          tags: newPost.tags,
          techStack: newPost.techStack,
          votes: 1,
          answersCount: 0,
          viewsCount: 1,
          status: newPost.category === "Problems" ? "Open" : undefined,
          thumbnailUrl: newPost.thumbnailUrl,
          author: {
            name: "Alex Mercer",
            avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
          },
          createdAt: "Just now",
          isBookmarked: false,
          isUpvoted: true,
        };
        MOCK_DISCUSSIONS.unshift(created);
        votesMap[created.id] = { votes: 1, isUpvoted: true };
        return { data: created };
      },
      invalidatesTags: [{ type: "Discussion" as const, id: "LIST" }],
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
  useCreateDiscussionMutation,
} = discussionsApi;
