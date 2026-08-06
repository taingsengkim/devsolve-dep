import { baseApi } from "../baseApi";
import {
  Program,
  PaginatedResponse,
  GetProgramsParams,
  ProgramDetail,
  CreateProgramRequest,
} from "@/lib/types/programs/types";

export * from "@/lib/types/programs/types";

export const programsApi = baseApi.injectEndpoints({
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

    // GET /programs/{id}
    getProgramById: builder.query<ProgramDetail, string>({
      query: (id) => `programs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Program", id }],
    }),

    createProgram: builder.mutation<Program, CreateProgramRequest>({
      query: (body) => ({
        url: "/organizations/me/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
} = programsApi;
