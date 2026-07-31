import { baseApi } from "./baseApi";
import { Researcher, LeaderboardStats } from "@/lib/types/leaderboard/types";
import {
  mockTopResearchers,
  mockRankingTable,
  mockLeaderboardStats,
} from "@/lib/types/leaderboard/mock-data";

export interface LeaderboardQueryParams {
  search?: string;
  category?: string;
  timeFrame?: "month" | "all";
  limit?: number;
}

export interface LeaderboardQueryResponse {
  topThree: Researcher[];
  researchers: Researcher[];
  stats: LeaderboardStats;
}

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardQueryResponse, LeaderboardQueryParams | void>({
      queryFn: (params) => {
        const allResearchers = [...mockTopResearchers, ...mockRankingTable].sort(
          (a, b) => a.rank - b.rank
        );
        const uniqueResearchers = Array.from(
          new Map(allResearchers.map((r) => [r.id, r])).values()
        ).sort((a, b) => a.rank - b.rank);

        let filtered = uniqueResearchers;
        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(
            (r) =>
              r.handle.toLowerCase().includes(q) ||
              r.realName.toLowerCase().includes(q)
          );
        }

        const topThree = uniqueResearchers.slice(0, 3);

        return {
          data: {
            topThree,
            researchers: filtered,
            stats: mockLeaderboardStats,
          },
        };
      },
      providesTags: ["User"],
    }),
    getResearcherById: builder.query<Researcher | null, string>({
      queryFn: (id) => {
        const allResearchers = [...mockTopResearchers, ...mockRankingTable];
        const found = allResearchers.find((r) => r.id === id) || null;
        return { data: found };
      },
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetLeaderboardQuery, useGetResearcherByIdQuery } = leaderboardApi;
export default leaderboardApi;