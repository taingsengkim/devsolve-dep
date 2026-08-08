import { baseApi } from "./baseApi";
import {
  DiscussionPost,
  DiscussionSort,
  TopicCount,
} from "@/lib/types/dicussion/types";
import { excerptOf } from "@/lib/markdown-excerpt";
import type { Page, ShowcaseResponse } from "./showcasesApi";
import type { ProblemResponse } from "./problemsApi";

/**
 * The community feed, built entirely from the API: problems from
 * `GET /api/v1/problems` (published only — a submission stays out until a
 * moderator approves it) and showcases from `GET /api/v1/showcases` (approved
 * only, likewise). The two are merged and then filtered, sorted and paginated
 * together, so one code path serves whatever a post came from.
 *
 * Nothing here is invented. Where a list response carries no figure — neither
 * endpoint returns vote or answer counts — the post gets a zero rather than a
 * number nobody could reproduce.
 */

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

// ─── Sorting helpers ──────────────────────────────────────────────────────────

/** `createdAt` is a display string ("Jun 12, 2025"). Unparsable values are
 *  treated as "now" so freshly created posts sort to the top. */
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

// ─── Mapping the two response shapes onto one card ───────────────────────────

/**
 * Both endpoints cap a page at 100. That is the ceiling on how many posts one
 * feed page can draw from; server-side paging can replace the merge once the
 * backend serves problems and showcases from a single feed endpoint.
 */
const FEED_PAGE_SIZE = 100;

function displayDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** The sidebar's tag vocabulary is written with a leading `#`. */
const hashed = (name?: string) => (name ? `#${name}` : "");

/** `ProblemResponse` in the shape this feed's card already renders. */
function problemToPost(problem: ProblemResponse): DiscussionPost {
  return {
    id: problem.id ?? "",
    title: problem.title ?? "Untitled problem",
    category: "Problems",
    // A problem's topic is its category — the vocabulary the sidebar counts.
    topic: problem.category?.name || "Uncategorised",
    description: excerptOf(problem.description ?? "", 240),
    tags: (problem.tags ?? []).map((tag) => hashed(tag.name)).filter(Boolean),
    techStack: (problem.technologies ?? [])
      .map((tech) => tech.name)
      .filter((name): name is string => Boolean(name)),
    /* `ProblemResponse` carries neither a vote score nor a solution count, so
       both stay at zero rather than being guessed at. */
    votes: 0,
    answersCount: 0,
    viewsCount: problem.viewCount ?? 0,
    status: problem.status === "RESOLVED" ? "Solved" : "Open",
    author: {
      name: problem.author?.fullName || "Unknown",
      avatarUrl: problem.author?.avatarUrl ?? "",
      reputation: problem.author?.reputation,
    },
    createdAt: displayDate(problem.publishedAt ?? problem.createdAt),
  };
}

/** `ShowCasesResponse` in the shape this feed's card already renders. */
function showcaseToPost(showcase: ShowcaseResponse): DiscussionPost {
  return {
    id: showcase.id,
    title: showcase.title,
    category: "Showcase",
    // A showcase carries its own category name where a problem carries a topic.
    topic: showcase.categoryName || "Showcase",
    description: excerptOf(showcase.overview ?? "", 240),
    tags: (showcase.tags ?? []).map((tag) => hashed(tag.name)).filter(Boolean),
    thumbnailUrl: showcase.coverImageUrl,
    // No vote or comment counts on the showcase list response either.
    votes: 0,
    answersCount: 0,
    viewsCount: showcase.viewCount ?? 0,
    author: { name: showcase.authorName || "Unknown", avatarUrl: "" },
    createdAt: displayDate(showcase.createdAt),
  };
}

/** What a target is called on the vote and bookmark endpoints. */
const targetTypeOf = (category: DiscussionPost["category"]) =>
  category === "Showcase" ? "SHOWCASE" : "PROBLEM";

// ─── API slice ────────────────────────────────────────────────────────────────

export const discussionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── List discussions with filter + pagination ───────────────────────────
    getDiscussions: builder.query<
      DiscussionsResponse,
      DiscussionsFilterParams | void
    >({
      queryFn: async (params, _api, _extraOptions, fetchWithBQ) => {
        const category = params?.category ?? "All";
        const search = params?.searchQuery?.trim();

        /* The category tab decides which halves are worth asking for, so a
           feed narrowed to one kind costs one request rather than two. */
        const wantProblems = category !== "Showcase";
        const wantShowcases = category !== "Problems";

        const [problemsResponse, showcasesResponse] = await Promise.all([
          wantProblems
            ? fetchWithBQ({
                url: "/problems",
                params: {
                  size: FEED_PAGE_SIZE,
                  sort: "publishedAt,DESC",
                  /* The problem feed filters by a single tag rather than a
                     free-text query, so the sidebar's tag selection is the
                     only narrowing that can happen upstream. */
                  ...(params?.tag ? { tag: params.tag.replace(/^#/, "") } : {}),
                },
              })
            : null,
          wantShowcases
            ? fetchWithBQ({
                url: "/showcases",
                params: {
                  pageSize: FEED_PAGE_SIZE,
                  sortBy: "createdAt",
                  sortDirection: "DESC",
                  // Narrowing upstream keeps the search from being limited to
                  // whatever the first page happened to contain.
                  ...(search ? { query: search } : {}),
                },
              })
            : null,
        ]);

        if (problemsResponse?.error) return { error: problemsResponse.error };
        if (showcasesResponse?.error) return { error: showcasesResponse.error };

        const problemPage = problemsResponse?.data as
          | Page<ProblemResponse>
          | undefined;
        const showcasePage = showcasesResponse?.data as
          | Page<ShowcaseResponse>
          | undefined;

        const problems = (problemPage?.content ?? []).map(problemToPost);
        const showcases = (showcasePage?.content ?? []).map(showcaseToPost);

        let results = [...problems, ...showcases];

        if (params?.topic) {
          results = results.filter((post) => post.topic === params.topic);
        }
        if (params?.tag) {
          results = results.filter((post) => post.tags.includes(params.tag!));
        }
        if (search) {
          const q = search.toLowerCase();
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

        results = sortDiscussions(results, params?.sort ?? "newest");

        const limit = params?.limit ?? 10;
        const totalCount = results.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        // Clamp so a stale page (e.g. after narrowing filters) never yields a blank feed.
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
              { type: "Showcase" as const, id: "LIST" },
              { type: "Problem" as const, id: "LIST" },
            ]
          : [
              { type: "Discussion" as const, id: "LIST" },
              { type: "Showcase" as const, id: "LIST" },
              { type: "Problem" as const, id: "LIST" },
            ],
    }),

    // ── Topic list ──────────────────────────────────────────────────────────
    /**
     * The sidebar's topics are the problem categories actually in use, counted
     * off the published feed. A category nobody has posted under does not
     * appear, because filtering by it would empty the feed.
     */
    getDiscussionTopics: builder.query<TopicCount[], void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        const response = await fetchWithBQ({
          url: "/problems",
          params: { size: FEED_PAGE_SIZE },
        });
        if (response.error) return { error: response.error };

        const page = response.data as Page<ProblemResponse>;
        const counts = new Map<string, number>();
        for (const problem of page?.content ?? []) {
          const name = problem.category?.name;
          if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
        }

        return {
          data: [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        };
      },
      providesTags: [
        { type: "Discussion" as const, id: "TOPICS" },
        { type: "Problem" as const, id: "LIST" },
      ],
    }),

    // ── Trending tags ───────────────────────────────────────────────────────
    /** The tags carried by published problems, commonest first. */
    getTrendingTags: builder.query<string[], void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        const response = await fetchWithBQ({
          url: "/problems",
          params: { size: FEED_PAGE_SIZE },
        });
        if (response.error) return { error: response.error };

        const page = response.data as Page<ProblemResponse>;
        const counts = new Map<string, number>();
        for (const problem of page?.content ?? []) {
          for (const tag of problem.tags ?? []) {
            const label = hashed(tag.name);
            if (label) counts.set(label, (counts.get(label) ?? 0) + 1);
          }
        }

        return {
          data: [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([label]) => label),
        };
      },
      providesTags: [
        { type: "Discussion" as const, id: "TAGS" },
        { type: "Problem" as const, id: "LIST" },
      ],
    }),

    // ── Platform stats ──────────────────────────────────────────────────────
    /**
     * Both totals are the `totalElements` the list endpoints report, so they
     * count everything published rather than the page fetched above.
     */
    getDiscussionStats: builder.query<DiscussionStats, void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        const [problems, showcases] = await Promise.all([
          fetchWithBQ({ url: "/problems", params: { size: 1 } }),
          fetchWithBQ({ url: "/showcases", params: { pageSize: 1 } }),
        ]);

        if (problems.error) return { error: problems.error };
        if (showcases.error) return { error: showcases.error };

        return {
          data: {
            problems:
              (problems.data as Page<ProblemResponse>)?.totalElements ?? 0,
            showcases:
              (showcases.data as Page<ShowcaseResponse>)?.totalElements ?? 0,
          },
        };
      },
      providesTags: [
        { type: "Discussion" as const, id: "STATS" },
        { type: "Problem" as const, id: "LIST" },
        { type: "Showcase" as const, id: "LIST" },
      ],
    }),

    // ── Vote mutation ───────────────────────────────────────────────────────
    /**
     * `PUT /api/v1/votes/{type}/{targetId}` sets the caller's vote; `DELETE`
     * withdraws it. The card sends where it is moving to, not a toggle, so a
     * double-tap cannot leave the two out of step.
     */
    voteDiscussion: builder.mutation<
      unknown,
      { id: string; category: DiscussionPost["category"]; upvote: boolean }
    >({
      query: ({ id, category, upvote }) => ({
        url: `/votes/${targetTypeOf(category)}/${id}`,
        ...(upvote
          ? { method: "PUT", body: { value: 1 } }
          : { method: "DELETE" }),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Discussion" as const, id },
      ],
    }),

    // ── Bookmark mutation ───────────────────────────────────────────────────
    /** `PUT`/`DELETE /api/v1/bookmarks/{type}/{targetId}`. */
    bookmarkDiscussion: builder.mutation<
      unknown,
      { id: string; category: DiscussionPost["category"]; bookmarked: boolean }
    >({
      query: ({ id, category, bookmarked }) => ({
        url: `/bookmarks/${targetTypeOf(category)}/${id}`,
        method: bookmarked ? "PUT" : "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Discussion" as const, id },
        { type: "Bookmark" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDiscussionsQuery,
  useGetDiscussionTopicsQuery,
  useGetTrendingTagsQuery,
  useGetDiscussionStatsQuery,
  useVoteDiscussionMutation,
  useBookmarkDiscussionMutation,
} = discussionsApi;
