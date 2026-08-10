import { baseApi } from "../baseApi";
import {
  PageProblemResponse,
  GetAdminProblemsParams,
  ProblemResponse,
  ProblemStatus,
} from "@/lib/types/admin/problemAdminTypes";

export type {
  PageProblemResponse,
  GetAdminProblemsParams,
  ProblemResponse,
  ProblemStatus,
};

export const problemAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProblems: builder.query<
      PageProblemResponse,
      GetAdminProblemsParams | void
    >({
      query: (params) => {
        const { status, page = 0, size = 20 } = params || {};
        const queryParams: Record<string, any> = { page, size };
        if (status) queryParams.status = status;
        return {
          url: "/admin/problems",
          params: queryParams,
        };
      },
      providesTags: ["AdminProblem"],
    }),

    moderateProblem: builder.mutation<
      ProblemResponse,
      { id: string; status: ProblemStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/problems/${id}/moderation`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminProblem", id },
        "AdminProblem",
      ],
    }),
  }),
});

export const { useGetAdminProblemsQuery, useModerateProblemMutation } =
  problemAdminApi;
