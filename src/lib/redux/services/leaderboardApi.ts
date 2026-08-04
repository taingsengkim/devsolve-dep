import { baseApi } from "./baseApi";
import {
  LeaderboardCountryOption,
  LeaderboardEntry,
  LeaderboardHighlight,
  LeaderboardPeriod,
  LeaderboardStats,
  SeverityLabel,
} from "@/lib/types/leaderboard/types";
import {
  CURRENT_USERNAME,
  getCountryOptions,
  getHighlights,
  getLeaderboardEntries,
  mockLeaderboardStats,
} from "@/lib/types/leaderboard/mock-data";

export interface LeaderboardQueryParams {
  period: LeaderboardPeriod;
  /** ISO-2 country code, or "all". */
  country?: string;
  /** Highest severity landed in the window, or "all". */
  severity?: SeverityLabel | "all";
  search?: string;
}

export interface LeaderboardQueryResponse {
  /** Filtered rows. `rank` stays the global rank for the period. */
  entries: LeaderboardEntry[];
  /** Top three overall — never affected by the filters. */
  podium: LeaderboardEntry[];
  highlights: LeaderboardHighlight[];
  countries: LeaderboardCountryOption[];
  totalRanked: number;
  stats: LeaderboardStats;
}

export interface MyRankResponse {
  entry: LeaderboardEntry | null;
  totalRanked: number;
  /** Percentile from the top, e.g. 12 → "top 12%". */
  topPercent: number | null;
}

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardQueryResponse, LeaderboardQueryParams>({
      queryFn: ({ period, country = "all", severity = "all", search = "" }) => {
        const all = getLeaderboardEntries(period);

        const query = search.trim().toLowerCase();
        const entries = all.filter((entry) => {
          if (country !== "all" && entry.countryCode !== country) return false;
          if (severity !== "all" && entry.topSeverity !== severity) return false;
          if (
            query &&
            !entry.displayName.toLowerCase().includes(query) &&
            !entry.username.toLowerCase().includes(query)
          )
            return false;
          return true;
        });

        return {
          data: {
            entries,
            podium: all.slice(0, 3),
            highlights: getHighlights(period),
            countries: getCountryOptions(period),
            totalRanked: all.length,
            stats: mockLeaderboardStats,
          },
        };
      },
      providesTags: ["User"],
    }),

    getMyLeaderboardRank: builder.query<MyRankResponse, LeaderboardPeriod>({
      queryFn: (period) => {
        const all = getLeaderboardEntries(period);
        const entry = all.find((e) => e.username === CURRENT_USERNAME) ?? null;
        return {
          data: {
            entry,
            totalRanked: all.length,
            topPercent: entry
              ? Math.max(1, Math.round((entry.rank / all.length) * 100))
              : null,
          },
        };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetLeaderboardQuery, useGetMyLeaderboardRankQuery } = leaderboardApi;
export default leaderboardApi;
