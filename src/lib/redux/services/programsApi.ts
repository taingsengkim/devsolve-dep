import { baseApi } from "./baseApi";
import {
  ProgramItem,
  ProgramsFilterParams,
  ProgramsResponse,
  AssetCategory,
} from "@/lib/types/programs/types";
import { MOCK_PROGRAMS } from "@/lib/types/programs/mock-data";

export * from "@/lib/types/programs/types";
export * from "@/lib/types/programs/mock-data";

export const programsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<ProgramsResponse, ProgramsFilterParams | void>({
      queryFn: (params) => {
        let results = [...MOCK_PROGRAMS];

        // Overall stats counts before search filter (or live counts)
        const counts = {
          all: MOCK_PROGRAMS.length,
          bounty: MOCK_PROGRAMS.filter((p) => p.type === "Bounty").length,
          response: MOCK_PROGRAMS.filter((p) => p.type === "Response").length,
          newCount: MOCK_PROGRAMS.filter((p) => p.isNew).length,
          privateCount: MOCK_PROGRAMS.filter((p) => p.isPrivate).length,
        };

        // 1. Quick filter
        if (params?.quickFilter && params.quickFilter !== "all") {
          if (params.quickFilter === "bounty") {
            results = results.filter((p) => p.type === "Bounty");
          } else if (params.quickFilter === "response") {
            results = results.filter((p) => p.type === "Response");
          } else if (params.quickFilter === "new") {
            results = results.filter((p) => p.isNew);
          } else if (params.quickFilter === "private") {
            results = results.filter((p) => p.isPrivate);
          }
        }

        // 2. Type Filter
        if (params?.type && params.type !== "All") {
          results = results.filter((p) => p.type === params.type);
        }

        // 3. Asset Scope Filter
        if (params?.category && params.category !== "All") {
          results = results.filter((p) =>
            p.assetCategories.includes(params.category as AssetCategory)
          );
        }

        // 4. Status Filter
        if (params?.status && params.status !== "All") {
          results = results.filter((p) => p.status === params.status);
        }

        // 5. Search Filter
        if (params?.search && params.search.trim() !== "") {
          const q = params.search.toLowerCase().trim();
          results = results.filter(
            (p) =>
              p.companyName.toLowerCase().includes(q) ||
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.inScopeAssets.some((asset) => asset.toLowerCase().includes(q))
          );
        }

        const limit = params?.limit || 10;
        const page = params?.page || 1;
        const totalCount = results.length;
        const totalPages = Math.ceil(totalCount / limit) || 1;

        const startIndex = (page - 1) * limit;
        const paginatedData = results.slice(startIndex, startIndex + limit);

        return {
          data: {
            data: paginatedData,
            totalCount,
            page,
            limit,
            totalPages,
            counts,
          },
        };
      },
      providesTags: ["Program"],
    }),

    getProgramById: builder.query<ProgramItem, string>({
      queryFn: (id) => {
        const found = MOCK_PROGRAMS.find((p) => p.id === id);
        if (found) {
          return { data: found };
        }
        return { error: { status: 404, data: "Program not found" } };
      },
      providesTags: (_result, _error, id) => [{ type: "Program", id }],
    }),
  }),
});

export const { useGetProgramsQuery, useGetProgramByIdQuery } = programsApi;
