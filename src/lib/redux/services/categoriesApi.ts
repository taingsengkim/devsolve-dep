import { proxyApi } from "./proxyApi";
import type {
  CategoryCreateValues,
  CategoryPatchValues,
  CategoryScope,
} from "@/lib/validations/category";

export type { CategoryScope };

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

/**
 * The backend returns categories unordered, so `sortOrder` is applied here.
 * Entries without one fall to the end and tie-break on name.
 */
const bySortOrder = (a: CategoryResponse, b: CategoryResponse) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.sortOrder ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name);

export const categoriesApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/categories — every category, including inactive ones. */
    getCategories: builder.query<CategoryResponse[], CategoryScope | void>({
      query: (scope) => ({
        url: "/categories",
        params: scope ? { scope } : undefined,
      }),
      transformResponse: (raw: CategoryResponse[]) => [...raw].sort(bySortOrder),
      providesTags: ["Category"],
    }),

    /** GET /api/categories/active — what the create forms offer. */
    getActiveCategories: builder.query<CategoryResponse[], CategoryScope | void>(
      {
        query: (scope) => ({
          url: "/categories/active",
          params: scope ? { scope } : undefined,
        }),
        transformResponse: (raw: CategoryResponse[]) =>
          [...raw].sort(bySortOrder),
        providesTags: ["Category"],
      },
    ),

    createCategory: builder.mutation<CategoryResponse, CategoryCreateValues>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; body: CategoryPatchValues }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useGetActiveCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
