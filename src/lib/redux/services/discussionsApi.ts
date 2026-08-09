import { baseApi } from "./baseApi";
import {
  DiscussionPost,
  DiscussionSort,
  TopicCount,
} from "@/lib/types/dicussion/types";

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

/** Platform totals the list endpoints can actually answer. */
export interface DiscussionStats {
  problems: number;
  showcases: number;
}

// ─── Real backend shapes (per devsolve-api.quizzy.it.com/v3/api-docs) ─────────
// Problems and showcases are two separate REST resources with different
// response shapes; both get flattened into the shared DiscussionPost shape
// the UI already renders. Neither carries a vote score or a comment/solution
// count, so those stay at 0 on the list until the user interacts with a
// specific card (see voteDiscussion) — there's no bulk aggregate endpoint for
// either, and doing per-item N+1 calls for every fetched row isn't worth it.

interface CategorySummary {
  id: string;
  name: string;
}

interface ProblemApiResponse {
  id: string;
  author?: { fullName?: string; avatarUrl?: string };
  category?: CategorySummary;
  title: string;
  description?: string;
  viewCount?: number;
  tags?: { name: string }[];
  publishedAt?: string;
  createdAt?: string;
}

interface PageProblemApiResponse {
  content: ProblemApiResponse[];
  totalElements: number;
}

interface ShowcaseApiResponse {
  id: string;
  authorName?: string;
  categoryName?: string;
  title: string;
  overview?: string;
  coverImageUrl?: string;
  viewCount?: number;
  createdAt?: string;
}

interface PageShowcaseApiResponse {
  content: ShowcaseApiResponse[];
  totalElements: number;
}

interface BookmarkApiResponse {
  bookmarkableType: "PROGRAM" | "PROBLEM" | "SOLUTION" | "SHOWCASE";
  bookmarkableId: string;
}

interface VoteApiResponse {
  type: "PROBLEM" | "SOLUTION" | "COMMENT" | "SHOWCASE";
  targetId: string;
  value: number;
}

interface VoteSummaryApiResponse {
  score: number;
  currentUserVote: number;
}

const LIST_PAGE_SIZE = 100;

function toRelativeDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffHrs = (Date.now() - date.getTime()) / 3_600_000;
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) {
    const hrs = Math.floor(diffHrs);
    return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(diffHrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toProblemPost(
  raw: ProblemApiResponse,
  isBookmarked: boolean,
  isUpvoted: boolean
): DiscussionPost {
  return {
    id: raw.id,
    title: raw.title,
    category: "Problems",
    topic: raw.category?.name ?? "General",
    description: raw.description ?? "",
    tags: (raw.tags ?? []).map((t) => t.name),
    votes: 0,
    answersCount: 0,
    viewsCount: raw.viewCount ?? 0,
    author: {
      name: raw.author?.fullName || "Community Member",
      avatarUrl: raw.author?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${raw.id}`,
    },
    createdAt: toRelativeDate(raw.publishedAt || raw.createdAt),
    isBookmarked,
    isUpvoted,
  };
}

function toShowcasePost(
  raw: ShowcaseApiResponse,
  isBookmarked: boolean,
  isUpvoted: boolean
): DiscussionPost {
  return {
    id: raw.id,
    title: raw.title,
    category: "Showcase",
    topic: raw.categoryName ?? "General",
    description: raw.overview ?? "",
    tags: [],
    techStack: [],
    votes: 0,
    answersCount: 0,
    viewsCount: raw.viewCount ?? 0,
    thumbnailUrl: raw.coverImageUrl,
    author: {
      name: raw.authorName || "Community Member",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${raw.id}`,
    },
    createdAt: toRelativeDate(raw.createdAt),
    isBookmarked,
    isUpvoted,
  };
}

// ─── Sorting helpers ──────────────────────────────────────────────────────────

function createdAtTime(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function sortDiscussions<T extends DiscussionPost>(
  list: T[],
  sort: DiscussionSort,
): T[] {
  const sorted = [...list];
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) => createdAtTime(a.createdAt) - createdAtTime(b.createdAt),
      );
    case "top":
      return sorted.sort((a, b) => b.votes - a.votes);
    case "discussed":
      return sorted.sort((a, b) => b.answersCount - a.answersCount);
    case "viewed":
      return sorted.sort((a, b) => b.viewsCount - a.viewsCount);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt),
      );
  }
}

// ─── API slice ────────────────────────────────────────────────────────────────

export const discussionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── List discussions with filter + pagination ───────────────────────────
    getDiscussions: builder.query<DiscussionsResponse, DiscussionsFilterParams | void>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const wantProblems = !params?.category || params.category === "All" || params.category === "Problems";
        const wantShowcases = !params?.category || params.category === "All" || params.category === "Showcase";

        const [problemsResult, showcasesResult, myVotesResult, myBookmarksResult] = await Promise.all([
          wantProblems ? fetchWithBQ(`/problems?size=${LIST_PAGE_SIZE}`) : Promise.resolve(null),
          wantShowcases ? fetchWithBQ(`/showcases?pageSize=${LIST_PAGE_SIZE}`) : Promise.resolve(null),
          fetchWithBQ(`/votes/mine?pageSize=${LIST_PAGE_SIZE}`),
          fetchWithBQ(`/bookmarks/mine?pageSize=${LIST_PAGE_SIZE}`),
        ]);

        if (problemsResult?.error) return { error: problemsResult.error };
        if (showcasesResult?.error) return { error: showcasesResult.error };

        // Best-effort: a logged-out visitor (401) just sees nothing as
        // bookmarked/upvoted rather than the whole feed failing to load.
        const upvotedKeys = new Set<string>();
        if (!myVotesResult.error) {
          const page = myVotesResult.data as { content: VoteApiResponse[] };
          page.content.forEach((v) => {
            if (v.value > 0) upvotedKeys.add(`${v.type}:${v.targetId}`);
          });
        }
        const bookmarkedKeys = new Set<string>();
        if (!myBookmarksResult.error) {
          const page = myBookmarksResult.data as { content: BookmarkApiResponse[] };
          page.content.forEach((b) => bookmarkedKeys.add(`${b.bookmarkableType}:${b.bookmarkableId}`));
        }

        const problems = wantProblems ? (problemsResult!.data as PageProblemApiResponse).content : [];
        const showcases = wantShowcases ? (showcasesResult!.data as PageShowcaseApiResponse).content : [];

        let results: DiscussionPost[] = [
          ...problems.map((p) =>
            toProblemPost(p, bookmarkedKeys.has(`PROBLEM:${p.id}`), upvotedKeys.has(`PROBLEM:${p.id}`))
          ),
          ...showcases.map((s) =>
            toShowcasePost(s, bookmarkedKeys.has(`SHOWCASE:${s.id}`), upvotedKeys.has(`SHOWCASE:${s.id}`))
          ),
        ];

        if (params?.topic) {
          results = results.filter((post) => post.topic === params.topic);
        }
        if (params?.tag) {
          results = results.filter((post) => post.tags.includes(params.tag!));
        }
        if (params?.searchQuery) {
          const q = params.searchQuery.toLowerCase();
          results = results.filter(
            (post) =>
              // Showcases were already matched upstream, against their full
              // overview rather than the excerpt held here — re-testing them
              // against the excerpt would drop genuine matches.
              post.category === "Showcase" ||
              post.title.toLowerCase().includes(q) ||
              post.description.toLowerCase().includes(q) ||
              post.tags.some((tag) => tag.toLowerCase().includes(q)),
          );
        }

        // "top"/"discussed" have nothing real to sort by (see the comment on
        // ProblemApiResponse above) — they fall back to insertion order, same
        // as any other tie, rather than actively misordering the feed.
        results = sortDiscussions(results, params?.sort ?? "newest");

        const limit = params?.limit ?? 10;
        const totalCount = results.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        const page = Math.min(Math.max(1, params?.page ?? 1), totalPages);
        const start = (page - 1) * limit;

        return {
          data: {
            data: results.slice(start, start + limit),
            totalCount,
            page,
            limit,
            totalPages,
          },
        };
      },
      /* Tagged against both source caches, so publishing or approving either
         kind of post refreshes this feed the same way it refreshes theirs. */
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Discussion" as const,
                id,
              })),
              { type: "Discussion" as const, id: "LIST" },
            ]
          : [{ type: "Discussion" as const, id: "LIST" }],
    }),

    // ── Fetch single discussion (problem, falling back to showcase) ─────────
    // Note: not currently rendered anywhere in the app — the real detail page
    // (ProblemDetailPage.tsx) still reads from a separate mock system. Wired
    // for correctness/parity with the list, not because something consumes it.
    getDiscussionById: builder.query<DiscussionPost | null, string>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        const [problemResult, statusResult, voteResult] = await Promise.all([
          fetchWithBQ(`/problems/${id}`),
          fetchWithBQ(`/bookmarks/PROBLEM/${id}/status`),
          fetchWithBQ(`/votes/PROBLEM/${id}/summary`),
        ]);

        if (!problemResult.error) {
          const isBookmarked = !statusResult.error && (statusResult.data as { bookmarked: boolean }).bookmarked;
          const isUpvoted = !voteResult.error && (voteResult.data as VoteSummaryApiResponse).currentUserVote > 0;
          const post = toProblemPost(problemResult.data as ProblemApiResponse, isBookmarked, isUpvoted);
          if (!voteResult.error) post.votes = (voteResult.data as VoteSummaryApiResponse).score;
          return { data: post };
        }

        const [showcaseResult, showcaseStatusResult, showcaseVoteResult] = await Promise.all([
          fetchWithBQ(`/showcases/${id}`),
          fetchWithBQ(`/bookmarks/SHOWCASE/${id}/status`),
          fetchWithBQ(`/votes/SHOWCASE/${id}/summary`),
        ]);
        if (showcaseResult.error) return { data: null };

        const isBookmarked =
          !showcaseStatusResult.error && (showcaseStatusResult.data as { bookmarked: boolean }).bookmarked;
        const isUpvoted =
          !showcaseVoteResult.error && (showcaseVoteResult.data as VoteSummaryApiResponse).currentUserVote > 0;
        const post = toShowcasePost(showcaseResult.data as ShowcaseApiResponse, isBookmarked, isUpvoted);
        if (!showcaseVoteResult.error) post.votes = (showcaseVoteResult.data as VoteSummaryApiResponse).score;
        return { data: post };
      },
      providesTags: (_result, _error, id) => [{ type: "Discussion" as const, id }],
    }),

    // ── Topic list (derived from live category usage on problems+showcases) ─
    getDiscussionTopics: builder.query<TopicCount[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [problemsResult, showcasesResult] = await Promise.all([
          fetchWithBQ(`/problems?size=${LIST_PAGE_SIZE}`),
          fetchWithBQ(`/showcases?pageSize=${LIST_PAGE_SIZE}`),
        ]);
        if (problemsResult.error) return { error: problemsResult.error };
        if (showcasesResult.error) return { error: showcasesResult.error };

        const counts = new Map<string, number>();
        (problemsResult.data as PageProblemApiResponse).content.forEach((p) => {
          const name = p.category?.name ?? "General";
          counts.set(name, (counts.get(name) ?? 0) + 1);
        });
        (showcasesResult.data as PageShowcaseApiResponse).content.forEach((s) => {
          const name = s.categoryName ?? "General";
          counts.set(name, (counts.get(name) ?? 0) + 1);
        });

        const topics: TopicCount[] = Array.from(counts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        return { data: topics };
      },
      providesTags: [{ type: "Discussion" as const, id: "TOPICS" }],
    }),

    // ── Trending tags (problems only — showcases carry no tags) ─────────────
    getTrendingTags: builder.query<string[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`/problems?size=${LIST_PAGE_SIZE}`);
        if (result.error) return { error: result.error };

        const counts = new Map<string, number>();
        (result.data as PageProblemApiResponse).content.forEach((p) => {
          (p.tags ?? []).forEach((t) => counts.set(t.name, (counts.get(t.name) ?? 0) + 1));
        });

        const tags = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([name]) => name);
        return { data: tags };
      },
      providesTags: [{ type: "Discussion" as const, id: "TAGS" }],
    }),

    // ── Platform stats ──────────────────────────────────────────────────────
    /**
     * Both totals are the `totalElements` the list endpoints report, so they
     * count everything published rather than the page fetched above.
     */
    getDiscussionStats: builder.query<DiscussionStats, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [problemsResult, showcasesResult] = await Promise.all([
          fetchWithBQ(`/problems?size=1`),
          fetchWithBQ(`/showcases?pageSize=1`),
        ]);
        return {
          data: {
            problems: problemsResult.error ? 0 : (problemsResult.data as PageProblemApiResponse).totalElements,
            showcases: showcasesResult.error ? 0 : (showcasesResult.data as PageShowcaseApiResponse).totalElements,
          },
        };
      },
      providesTags: [{ type: "Discussion" as const, id: "STATS" }],
    }),

    // ── Categories for the create-post topic picker ─────────────────────────
    getDiscussionCategories: builder.query<{ id: string; name: string }[], "PROBLEM" | "SHOWCASE">({
      query: (scope) => `/categories/active?scope=${scope}`,
      providesTags: [{ type: "Discussion" as const, id: "CATEGORIES" }],
    }),

    // ── Vote mutation ───────────────────────────────────────────────────────
    /**
     * `PUT /api/v1/votes/{type}/{targetId}` sets the caller's vote; `DELETE`
     * withdraws it. The card sends where it is moving to, not a toggle, so a
     * double-tap cannot leave the two out of step.
     */
    voteDiscussion: builder.mutation<
      { id: string; votes: number; isUpvoted: boolean },
      { id: string; type: "PROBLEM" | "SHOWCASE"; isUpvoted: boolean }
    >({
      async queryFn({ id, type, isUpvoted }, _api, _extraOptions, fetchWithBQ) {
        const result = isUpvoted
          ? await fetchWithBQ({ url: `/votes/${type}/${id}`, method: "PUT", body: { value: 1 } })
          : await fetchWithBQ({ url: `/votes/${type}/${id}`, method: "DELETE" });
        if (result.error) return { error: result.error };

        const summary = await fetchWithBQ(`/votes/${type}/${id}/summary`);
        const votes = summary.error ? 0 : (summary.data as VoteSummaryApiResponse).score;
        return { data: { id, votes, isUpvoted } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Discussion" as const, id }],
    }),

    // ── Create discussion mutation (problem or showcase) ─────────────────────
    createDiscussion: builder.mutation<
      DiscussionPost,
      {
        title: string;
        category: "Problems" | "Showcase";
        categoryId?: string;
        description: string;
        tags: string[];
        techStack?: string[];
        codeSnippet?: string;
        thumbnailUrl?: string;
      }
    >({
      async queryFn(newPost, _api, _extraOptions, fetchWithBQ) {
        if (newPost.category === "Problems") {
          const description = newPost.codeSnippet
            ? `${newPost.description}\n\n\`\`\`\n${newPost.codeSnippet}\n\`\`\``
            : newPost.description;
          const result = await fetchWithBQ({
            url: "/problems",
            method: "POST",
            body: {
              categoryId: newPost.categoryId || undefined,
              title: newPost.title,
              description,
              tags: newPost.tags.map((t) => t.replace(/^#/, "")),
            },
          });
          if (result.error) return { error: result.error };
          return { data: toProblemPost(result.data as ProblemApiResponse, false, false) };
        }

        const result = await fetchWithBQ({
          url: "/showcases",
          method: "POST",
          body: {
            categoryId: newPost.categoryId || undefined,
            title: newPost.title,
            overview: newPost.techStack?.length
              ? `${newPost.description}\n\n**Tech stack:** ${newPost.techStack.join(", ")}`
              : newPost.description,
            coverImageUrl: newPost.thumbnailUrl,
          },
        });
        if (result.error) return { error: result.error };
        return { data: toShowcasePost(result.data as ShowcaseApiResponse, false, false) };
      },
      invalidatesTags: [{ type: "Discussion" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetDiscussionsQuery,
  useGetDiscussionTopicsQuery,
  useGetTrendingTagsQuery,
  useGetDiscussionStatsQuery,
  useGetDiscussionCategoriesQuery,
  useVoteDiscussionMutation,
  useCreateDiscussionMutation,
} = discussionsApi;
