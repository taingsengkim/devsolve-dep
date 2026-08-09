import { baseApi } from "../baseApi";
import {
  PageSolutionResponse,
  GetAdminSolutionsParams,
  SolutionResponse,
  SolutionReviewStatus,
} from "@/lib/types/admin/solutionAdminTypes";

export type {
  PageSolutionResponse,
  GetAdminSolutionsParams,
  SolutionResponse,
  SolutionReviewStatus,
};

export const solutionAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSolutions: builder.query<
      PageSolutionResponse,
      GetAdminSolutionsParams | void
    >({
      query: (params) => {
        const { reviewStatus = "PENDING", pageNumber = 0, pageSize = 20 } =
          params || {};
        return {
          url: "/admin/solutions",
          params: { reviewStatus, pageNumber, pageSize },
        };
      },
      providesTags: ["AdminSolution"],
    }),

    getAdminSolutionDetail: builder.query<SolutionResponse, string>({
      query: (id) => ({
        url: `/admin/solutions/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminSolution", id }],
    }),

    updateSolutionReviewStatus: builder.mutation<
      SolutionResponse,
      { id: string; reviewStatus: SolutionReviewStatus; rejectionReason?: string }
    >({
      query: ({ id, reviewStatus, rejectionReason }) => ({
        url: `/admin/solutions/${id}/review-status`,
        method: "PATCH",
        body: { reviewStatus, rejectionReason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminSolution", id },
        "AdminSolution",
      ],
    }),
  }),
});

export const {
  useGetAdminSolutionsQuery,
  useGetAdminSolutionDetailQuery,
  useUpdateSolutionReviewStatusMutation,
} = solutionAdminApi;
