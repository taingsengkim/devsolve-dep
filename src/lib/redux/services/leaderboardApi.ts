import { proxyApi } from "./proxyApi";
import {
  LeaderboardCountryOption,
  LeaderboardEntry,
  LeaderboardHighlight,
  LeaderboardPeriod,
  LeaderboardStats,
  SeverityLabel,
} from "@/lib/types/leaderboard/types";
import {
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

interface LeaderboardApiItem {
  rank: number;
  id: string;
  fullName?: string;
  avatarUrl?: string;
  country?: string;
  reputation?: number;
  totalReports?: number;
  validReports?: number;
  criticalReports?: number;
  recognitionCount?: number;
}

interface LeaderboardApiPage {
  totalElements?: number;
  totalPages?: number;
  size?: number;
  content?: LeaderboardApiItem[];
  number?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

interface CurrentUserProfile {
  id?: string;
}

function mapProfileToEntry(
  profile: LeaderboardApiItem,
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
    rank: profile.rank,
    previousRank: null,
    // The leaderboard endpoint exposes user ids, not profile slugs.
    username: profile.id,
    displayName: name,
    avatarUrl: profile.avatarUrl,
    avatarInitials: initials,
    countryCode: profile.country || "Unknown",
    countryName: profile.country || "Unknown country",
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

function filterEntries(
  entries: LeaderboardEntry[],
  {
    country,
    severity,
    queryTerm,
  }: { country: string; severity: SeverityLabel | "all"; queryTerm: string }
) {
  return entries.filter((entry) => {
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
}

function countryOptionsOf(entries: LeaderboardEntry[]): LeaderboardCountryOption[] {
  const counts = new Map<string, LeaderboardCountryOption>();

  for (const entry of entries) {
    const existing = counts.get(entry.countryCode);
    if (existing) existing.count += 1;
    else {
      counts.set(entry.countryCode, {
        code: entry.countryCode,
        name: entry.countryName,
        count: 1,
      });
    }
  }

  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function statsOf(entries: LeaderboardEntry[]): LeaderboardStats {
  return {
    activeResearchers: entries.length,
    validReports: entries.reduce((sum, entry) => sum + entry.validReports, 0),
    programsLive: 0,
  };
}

export const leaderboardApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardQueryResponse, LeaderboardQueryParams>({
      queryFn: async (
        { period, country = "all", severity = "all", search = "" },
        _api,
        _extra,
        fetchWithBQ
      ) => {
        const queryTerm = search.trim().toLowerCase();
        let myUserId: string | undefined;

        try {
          const [leaderboardResult, meResult] = await Promise.all([
            fetchWithBQ(`/reputation/leaderboard`),
            fetchWithBQ(`/user-profiles/me`),
          ]);

          if ("data" in meResult && meResult.data) {
            const me = meResult.data as CurrentUserProfile;
            if (me.id) myUserId = me.id;
          }

          if ("error" in leaderboardResult && leaderboardResult.error) {
            throw leaderboardResult.error;
          }

          const leaderboardPage = leaderboardResult.data as LeaderboardApiPage;
          const allEntries = (leaderboardPage.content ?? []).map((entry) =>
            mapProfileToEntry(entry, myUserId),
          );
          const filteredEntries = filterEntries(allEntries, {
            country,
            severity,
            queryTerm,
          });

          return {
            data: {
              entries: filteredEntries,
              podium: allEntries.slice(0, 3),
              highlights: getHighlights(period),
              countries: countryOptionsOf(allEntries),
              totalRanked: leaderboardPage.totalElements ?? allEntries.length,
              stats: statsOf(allEntries),
            },
          };
        } catch {
          // Fall back gracefully to mock entries if backend is unreachable
        }

        const mockAll = getLeaderboardEntries(period);
        const filteredMock = filterEntries(mockAll, {
          country,
          severity,
          queryTerm,
        });

        return {
          data: {
            entries: filteredMock,
            podium: mockAll.slice(0, 3),
            highlights: getHighlights(period),
            countries: getCountryOptions(period),
            totalRanked: mockAll.length,
            stats: mockLeaderboardStats,
          },
        };
      },
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
export default leaderboardApi;
