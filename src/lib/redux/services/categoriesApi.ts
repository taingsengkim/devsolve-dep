import { baseApi } from "./baseApi";

export type CategoryScope = "PROBLEM" | "SHOWCASE";

/** Mirrors the backend `CategoryResponse` schema. */
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  scope: CategoryScope;
  description?: string;
  iconUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/v1/categories/active — the pickable categories for one scope.
     * The backend returns them unordered, so `sortOrder` is applied here;
     * entries without one fall to the end and tie-break by name.
     */
    getActiveCategories: builder.query<CategoryResponse[], CategoryScope | void>({
      query: (scope) => ({
        url: "/categories/active",
        params: scope ? { scope } : undefined,
      }),
      transformResponse: (raw: CategoryResponse[]) =>
        [...raw].sort(
          (a, b) =>
            (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
              (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
            a.name.localeCompare(b.name),
        ),
      providesTags: ["Category"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetActiveCategoriesQuery } = categoriesApi;
