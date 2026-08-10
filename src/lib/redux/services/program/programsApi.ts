import { proxyApi } from "../proxyApi";
import {
  Program,
  PaginatedResponse,
  GetProgramsParams,
  ProgramDetail,
  CreateProgramRequest,
} from "@/lib/types/programs/types";
import { PageProgramManagementSummaryResponseDto } from "@/lib/types/admin/programAdminTypes";

export * from "@/lib/types/programs/types";

export const programsApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /programs?page=0&size=20&search=...
    getPrograms: builder.query<
      PaginatedResponse<Program>,
      GetProgramsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        // Convert 1-indexed UI page to 0-indexed Spring Boot page
        if (params?.page !== undefined) {
          queryParams.append("page", (params.page - 1).toString());
        }
        if (params?.size) {
          queryParams.append("size", params.size.toString());
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }
        if (params?.engagementType && params.engagementType !== "All") {
          queryParams.append("engagementType", params.engagementType);
        }
        if (params?.state && params.state !== "All") {
          queryParams.append("state", params.state);
        }

        const queryString = queryParams.toString();
        return queryString ? `programs?${queryString}` : "programs";
      },
      providesTags: ["Program"],
    }),

    // GET /organizations/me/programs (COMPANY role)
    getMyCompanyPrograms: builder.query<
      PageProgramManagementSummaryResponseDto,
      { page?: number; size?: number; sort?: string; state?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) {
          queryParams.append("page", params.page.toString());
        }
        if (params?.size) {
          queryParams.append("size", params.size.toString());
        }
        if (params?.sort) {
          queryParams.append("sort", params.sort);
        }
        if (params?.state && params.state !== "All") {
          queryParams.append("state", params.state);
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }

        const queryString = queryParams.toString();
        return queryString
          ? `organizations/me/programs?${queryString}`
          : "organizations/me/programs";
      },
      providesTags: ["Program"],
    }),

    // GET /programs/{id}
    getProgramById: builder.query<ProgramDetail, string>({
      query: (id) => `programs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Program", id }],
    }),

    createProgram: builder.mutation<Program, CreateProgramRequest & { state?: string }>({
      query: (body) => ({
        url: "/organizations/me/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    updateProgram: builder.mutation<
      Program,
      { id: string; body: Partial<CreateProgramRequest> & { state?: string } }
    >({
      query: ({ id, body }) => ({
        url: `/organizations/me/programs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Program",
        { type: "Program", id },
      ],
    }),

    deleteProgram: builder.mutation<void, string>({
      query: (id) => ({
        url: `/organizations/me/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Program",
        { type: "Program", id },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetProgramsQuery,
  useGetMyCompanyProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programsApi;
