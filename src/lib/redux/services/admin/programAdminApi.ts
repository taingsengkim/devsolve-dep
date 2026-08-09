import { proxyApi } from "../proxyApi";
import {
  PageProgramManagementSummaryResponseDto,
  GetAdminProgramsParams,
  ProgramManagementSummaryItem,
  ProgramSubmissionState,
  ProgramState,
} from "@/lib/types/admin/programAdminTypes";

export type {
  PageProgramManagementSummaryResponseDto,
  GetAdminProgramsParams,
  ProgramManagementSummaryItem,
  ProgramSubmissionState,
  ProgramState,
};

export const programAdminApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPrograms: builder.query<
      PageProgramManagementSummaryResponseDto,
      GetAdminProgramsParams | void
    >({
      query: (params) => {
        const { submissionState, state, page = 0, size = 20 } = params || {};
        const queryParams: Record<string, any> = { page, size };
        if (submissionState) queryParams.submissionState = submissionState;
        if (state) queryParams.state = state;
        return {
          url: "/admin/programs",
          params: queryParams,
        };
      },
      providesTags: ["AdminProgram"],
    }),

    getProgramDetail: builder.query<any, string>({
      query: (id) => ({
        url: `/programs/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminProgram", id }],
    }),

    approveProgram: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/programs/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminProgram", id },
        "AdminProgram",
      ],
    }),

    rejectProgram: builder.mutation<any, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/programs/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminProgram", id },
        "AdminProgram",
      ],
    }),
  }),
});

export const {
  useGetAdminProgramsQuery,
  useGetProgramDetailQuery,
  useApproveProgramMutation,
  useRejectProgramMutation,
} = programAdminApi;
