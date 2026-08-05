import { baseApi } from "./baseApi";
import {
  BookmarkItem,
  BookmarkFilterParams,
  BookmarksResponse,
  BookmarkableType,
} from "@/lib/types/bookmarks/types";

export * from "@/lib/types/bookmarks/types";

// Real shape of GET /api/v1/bookmarks/mine content items (per the live OpenAPI
// spec at devsolve-api.quizzy.it.com/v3/api-docs). No tags, severity, bounty,
// author, or stats data is included anywhere on this object — only enough to
// identify and link back to the bookmarked target — so those richer fields on
// BookmarkItem stay undefined for real data (BookmarkCard renders around that).
interface BookmarkApiResponse {
  id: string;
  bookmarkableType: BookmarkableType;
  bookmarkableId: string;
  available: boolean;
  targetTitle: string;
  targetPreview: string;
  targetImageUrl?: string;
  createdAt: string;
}

interface PageBookmarkApiResponse {
  content: BookmarkApiResponse[];
  totalElements: number;
}

function toCategory(type: BookmarkableType): BookmarkItem["category"] {
  switch (type) {
    case "PROGRAM":
      return "Program";
    case "SOLUTION":
      return "Solutions";
    case "PROBLEM":
    case "SHOWCASE":
      return "Problems";
  }
}

// Discussions/problems aren't wired to real data yet (see discussionsApi.ts),
// so PROBLEM/SHOWCASE targets still route through the discussions list rather
// than a not-yet-real detail-by-id page.
function toDetailUrl(type: BookmarkableType, targetId: string): string {
  switch (type) {
    case "PROGRAM":
      return `/dashboard/programs/${targetId}`;
    case "SOLUTION":
    case "PROBLEM":
    case "SHOWCASE":
      return `/discussions/${targetId}`;
  }
}

function toSavedAt(iso: string): string {
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

function toBookmarkItem(raw: BookmarkApiResponse): BookmarkItem {
  return {
    id: raw.id,
    bookmarkableId: raw.bookmarkableId,
    bookmarkableType: raw.bookmarkableType,
    category: toCategory(raw.bookmarkableType),
    title: raw.targetTitle,
    description: raw.targetPreview,
    savedAt: toSavedAt(raw.createdAt),
    tags: [],
    url: toDetailUrl(raw.bookmarkableType, raw.bookmarkableId),
    logoUrl: raw.targetImageUrl,
  };
}

// Problems/showcases are also cached as DiscussionPost rows (discussionsApi),
// which bake in their own `isBookmarked` snapshot at fetch time. Toggling a
// bookmark only invalidates "Bookmark" tags, so without this the discussion
// list/detail cache never re-syncs and can show a reverted bookmark state
// after a remount. { type: "Discussion", id } matches the per-row tag both
// getDiscussions and getDiscussionById already provide, so this refetches
// both without needing to know which one is currently mounted.
function bookmarkableDiscussionTags(type: BookmarkableType, targetId: string) {
  return type === "PROBLEM" || type === "SHOWCASE"
    ? [{ type: "Discussion" as const, id: targetId }]
    : [];
}

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query<BookmarksResponse, BookmarkFilterParams | void>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`/bookmarks/mine?pageSize=100`);
        if (result.error) return { error: result.error };

        const page = result.data as PageBookmarkApiResponse;
        let items = page.content.map(toBookmarkItem);

        const counts = {
          all: items.length,
          Program: items.filter((b) => b.category === "Program").length,
          Problems: items.filter((b) => b.category === "Problems").length,
          Solutions: items.filter((b) => b.category === "Solutions").length,
        };

        if (params?.category && params.category !== "all") {
          items = items.filter((b) => b.category === params.category);
        }

        if (params?.search && params.search.trim() !== "") {
          const q = params.search.toLowerCase().trim();
          items = items.filter(
            (b) => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
          );
        }

        // No severity data exists on a bookmark row (see BookmarkApiResponse above),
        // so the severity filter is intentionally a no-op until that lands upstream.

        if (params?.sortBy === "title") {
          items = [...items].sort((a, b) => a.title.localeCompare(b.title));
        } else if (params?.sortBy === "oldest") {
          items = [...items].reverse();
        }

        return { data: { data: items, counts, totalCount: page.totalElements } };
      },
      providesTags: ["Bookmark"],
    }),

    getBookmarkStatus: builder.query<boolean, { type: BookmarkableType; targetId: string }>({
      async queryFn({ type, targetId }, _api, _extraOptions, fetchWithBQ) {
        // This endpoint always returns 200 (no 404-for-"not bookmarked" case) —
        // the actual state lives in the response body's `bookmarked` field, not
        // in whether the request succeeded. A request failure (401 for a
        // logged-out visitor, network error, etc.) is treated as "not
        // bookmarked" since this only drives a Save button's initial state.
        const result = await fetchWithBQ(`/bookmarks/${type}/${targetId}/status`);
        if (result.error) return { data: false };
        return { data: (result.data as { bookmarked: boolean }).bookmarked };
      },
      providesTags: (_result, _error, { type, targetId }) => [
        { type: "Bookmark", id: `${type}:${targetId}` },
      ],
    }),

    addBookmark: builder.mutation<void, { type: BookmarkableType; targetId: string }>({
      query: ({ type, targetId }) => ({
        url: `/bookmarks/${type}/${targetId}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { type, targetId }) => [
        "Bookmark",
        { type: "Bookmark", id: `${type}:${targetId}` },
        ...bookmarkableDiscussionTags(type, targetId),
      ],
    }),

    removeBookmark: builder.mutation<void, { type: BookmarkableType; targetId: string }>({
      query: ({ type, targetId }) => ({
        url: `/bookmarks/${type}/${targetId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { type, targetId }) => [
        "Bookmark",
        { type: "Bookmark", id: `${type}:${targetId}` },
        ...bookmarkableDiscussionTags(type, targetId),
      ],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useGetBookmarkStatusQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = bookmarksApi;
