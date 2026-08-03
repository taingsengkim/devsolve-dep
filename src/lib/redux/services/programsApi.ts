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

// Real shape of GET /api/v1/programs content items (per the live OpenAPI
// spec at devsolve-api.quizzy.it.com/v3/api-docs). getPrograms/getProgramById
// below stay on mock data for the public/dashboard program browsing pages —
// converting those is a separate, larger task (no status/visibility field on
// this summary DTO, and several mock-only filters like isNew/isPrivate have
// no backend equivalent). This is used only to give the submit-report form a
// real programId/assetId to submit against.
interface ProgramSummaryApiResponse {
  id: string;
  organizationId: string;
  organizationName?: string;
  handle?: string;
  name: string;
  description?: string;
  engagementType: "BOUNTY" | "RESPONSE";
  offersBounties?: boolean;
  minimumBounty?: number;
  maximumBounty?: number;
  inScopeAssets?: { id: string; assetType: string; identifier: string; isInScope?: boolean }[];
}

export interface SubmittableProgram extends ProgramItem {
  // Raw in-scope assets (with their real UUIDs) alongside ProgramItem's
  // `inScopeAssets: string[]` display list, so the submit-report form can
  // resolve the typed target URL back to a real assetId.
  assets: { id: string; identifier: string }[];
}

function toRewardRange(raw: ProgramSummaryApiResponse): string {
  if (!raw.offersBounties) return "Reputation points";
  const { minimumBounty: min, maximumBounty: max } = raw;
  if (min != null && max != null) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  if (max != null) return `Up to $${max.toLocaleString()}`;
  return "Bounty";
}

function toSubmittableProgram(raw: ProgramSummaryApiResponse): SubmittableProgram {
  const assets = raw.inScopeAssets ?? [];
  return {
    id: raw.id,
    companyName: raw.organizationName || raw.name,
    companySlug: raw.handle || raw.id,
    type: raw.engagementType === "RESPONSE" ? "Response" : "Bounty",
    // No status/visibility field on the summary DTO — assumed open since
    // only currently-open programs are expected to accept submissions.
    status: "Open",
    title: raw.name,
    description: raw.description ?? "",
    inScopeAssets: assets.map((a) => a.identifier),
    assetCategories: [],
    rewardRange: toRewardRange(raw),
    rewardType: raw.offersBounties ? "bounty" : "points",
    maxReward: raw.maximumBounty != null ? `$${raw.maximumBounty.toLocaleString()}` : undefined,
    assets: assets.map((a) => ({ id: a.id, identifier: a.identifier })),
  };
}

export const programsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmittablePrograms: builder.query<SubmittableProgram[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`/programs?size=100`);
        if (result.error) return { error: result.error };
        const raw = (result.data as { content?: ProgramSummaryApiResponse[] } | undefined)?.content ?? [];
        return { data: raw.map(toSubmittableProgram) };
      },
      providesTags: ["Program"],
    }),

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

export const { useGetProgramsQuery, useGetProgramByIdQuery, useGetSubmittableProgramsQuery } = programsApi;
