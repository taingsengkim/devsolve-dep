import { baseApi } from "./baseApi";
import {
  BookmarkItem,
  BookmarkFilterParams,
  BookmarksResponse,
} from "@/lib/types/bookmarks/types";
import { MOCK_BOOKMARKS } from "@/lib/types/bookmarks/mock-data";

export * from "@/lib/types/bookmarks/types";
export * from "@/lib/types/bookmarks/mock-data";

// In-memory store for interactive bookmark toggle during session
let inMemoryBookmarks = [...MOCK_BOOKMARKS];

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query<BookmarksResponse, BookmarkFilterParams | void>({
      queryFn: (params) => {
        let results = [...inMemoryBookmarks];

        // Overall counts
        const counts = {
          all: inMemoryBookmarks.length,
          Program: inMemoryBookmarks.filter((b) => b.category === "Program").length,
          Problems: inMemoryBookmarks.filter((b) => b.category === "Problems").length,
          Solutions: inMemoryBookmarks.filter((b) => b.category === "Solutions").length,
        };

        // 1. Filter by category tab
        if (params?.category && params.category !== "all") {
          results = results.filter((b) => b.category === params.category);
        }

        // 2. Filter by search query
        if (params?.search && params.search.trim() !== "") {
          const q = params.search.toLowerCase().trim();
          results = results.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q) ||
              b.tags.some((tag) => tag.toLowerCase().includes(q)) ||
              (b.companyName && b.companyName.toLowerCase().includes(q)) ||
              (b.authorName && b.authorName.toLowerCase().includes(q))
          );
        }

        // 3. Filter by severity if specified
        if (params?.severity && params.severity !== "All") {
          results = results.filter((b) => b.severity === params.severity);
        }

        // 4. Sort
        if (params?.sortBy === "title") {
          results.sort((a, b) => a.title.localeCompare(b.title));
        }

        return {
          data: {
            data: results,
            counts,
            totalCount: inMemoryBookmarks.length,
          },
        };
      },
      providesTags: ["Bookmark"],
    }),

    removeBookmark: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: (id) => {
        inMemoryBookmarks = inMemoryBookmarks.filter((b) => b.id !== id);
        return { data: { success: true, id } };
      },
      invalidatesTags: ["Bookmark"],
    }),

    addBookmark: builder.mutation<BookmarkItem, BookmarkItem>({
      queryFn: (newBookmark) => {
        if (!inMemoryBookmarks.some((b) => b.id === newBookmark.id)) {
          inMemoryBookmarks = [newBookmark, ...inMemoryBookmarks];
        }
        return { data: newBookmark };
      },
      invalidatesTags: ["Bookmark"],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useRemoveBookmarkMutation,
  useAddBookmarkMutation,
} = bookmarksApi;
