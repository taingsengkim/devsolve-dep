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

interface PublicUserProfileItem {
  id: string;
  fullName?: string;
  biography?: string;
  avatarUrl?: string;
  country?: string;
  socialLinks?: { platform: string; url: string }[];
  reputation?: number;
  totalReports?: number;
  validReports?: number;
  criticalReports?: number;
  recognitionCount?: number;
  joinedAt?: string;
}

function mapProfileToEntry(
  profile: PublicUserProfileItem,
  index: number,
  myUserId?: string
): LeaderboardEntry {
  const name = profile.fullName?.trim() || "Anonymous Researcher";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AR";

  const critical = profile.criticalReports ?? 0;
  const valid = profile.validReports ?? 0;
  const total = profile.totalReports ?? 0;
  const high = Math.max(0, valid - critical);
  const topSeverity: SeverityLabel =
    critical > 0 ? "Critical" : valid > 0 ? "High" : "Low";

  return {
    id: profile.id,
    rank: index + 1,
    previousRank: index + 1,
    username: profile.id,
    displayName: name,
    avatarUrl: profile.avatarUrl,
    avatarInitials: initials,
    countryCode: profile.country || "US",
    countryName: profile.country || "United States",
    reputation: profile.reputation ?? 0,
    totalReports: total,
    validReports: valid,
    criticalReports: critical,
    recognitionCount: profile.recognitionCount ?? 0,
    severity: {
      critical,
      high,
      medium: 0,
      low: 0,
    },
    topSeverity,
    isCurrentUser: profile.id === myUserId,
  };
}

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardQueryResponse, LeaderboardQueryParams>({
      queryFn: async (
        { period, country = "all", severity = "all", search = "" },
        _api,
        _extra,
        fetchWithBQ
      ) => {
        const queryTerm = search.trim().toLowerCase();
        let apiEntries: LeaderboardEntry[] = [];
        let myUserId: string | undefined = undefined;

        try {
          // Attempt to resolve signed-in user's profile ID for `isCurrentUser` indicator
          const meResult = await fetchWithBQ(`/user-profiles/me`);
          if (meResult.data) {
            const me = meResult.data as { id?: string };
            if (me.id) myUserId = me.id;
          }

          // Search live public user profiles from backend database via Next.js proxy route
          const profileQuery = queryTerm ? `?query=${encodeURIComponent(queryTerm)}&pageSize=100` : `?pageSize=100`;
          const profilesResult = await fetchWithBQ(`/user-profiles${profileQuery}`);

          if (profilesResult.data) {
            const res = profilesResult.data as { content?: PublicUserProfileItem[] };
            if (Array.isArray(res.content) && res.content.length > 0) {
              const sorted = [...res.content].sort(
                (a, b) => (b.reputation ?? 0) - (a.reputation ?? 0)
              );
              apiEntries = sorted.map((p, idx) => mapProfileToEntry(p, idx, myUserId));
            }
          }
        } catch {
          // Fall back gracefully to mock entries if backend is unreachable
        }

        // Standard mock leaderboard fallback
        const mockAll = getLeaderboardEntries(period);
        const filteredMock = mockAll.filter((entry) => {
          if (country !== "all" && entry.countryCode !== country) return false;
          if (severity !== "all" && entry.topSeverity !== severity) return false;
          if (
            queryTerm &&
            !entry.displayName.toLowerCase().includes(queryTerm) &&
            !entry.username.toLowerCase().includes(queryTerm)
          ) {
            return false;
          }
          return true;
        });

        // Use live API entries when available, filtered by country and severity
        let finalEntries = apiEntries.length > 0 ? apiEntries : filteredMock;

        if (apiEntries.length > 0) {
          finalEntries = finalEntries.filter((entry) => {
            if (country !== "all" && entry.countryCode !== country) return false;
            if (severity !== "all" && entry.topSeverity !== severity) return false;
            return true;
          });
        }

        const podiumSource = apiEntries.length >= 3 ? apiEntries : mockAll;

        return {
          data: {
            entries: finalEntries,
            podium: podiumSource.slice(0, 3),
            highlights: getHighlights(period),
            countries: getCountryOptions(period),
            totalRanked: Math.max(finalEntries.length, mockAll.length),
            stats: mockLeaderboardStats,
          },
        };
      },
      providesTags: ["User", "Profile"],
    }),

    getMyLeaderboardRank: builder.query<MyRankResponse, LeaderboardPeriod>({
      queryFn: async (period, _api, _extra, fetchWithBQ) => {
        try {
          const meResult = await fetchWithBQ(`/user-profiles/me`);
          if (meResult.data) {
            const me = meResult.data as PublicUserProfileItem;
            if (me.id) {
              const entry = mapProfileToEntry(me, 0, me.id);
              entry.isCurrentUser = true;
              return {
                data: {
                  entry,
                  totalRanked: 100,
                  topPercent: 5,
                },
              };
            }
          }
        } catch {
          // Fall back to mock
        }

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
      providesTags: ["User", "Profile"],
    }),
  }),
});

export const { useGetLeaderboardQuery, useGetMyLeaderboardRankQuery } = leaderboardApi;
export default leaderboardApi;
