import { baseApi } from "./baseApi";
import {
  Profile,
  ProfileStats,
  SeverityStats,
  ProfileBadge,
  Severity,
  HacktivityEntry,
  CommunityPost,
  ThanksEntry,
  EditProfileFormData,
  SocialLinksForm,
  AccountStatus,
  FollowingCounts,
  FollowRecord,
} from "@/lib/types/profile/types";
import {
  mockProfile,
  mockThanks,
  mockEditProfileFormData,
} from "@/lib/types/profile/mock-data";

interface ProfileOverviewResponse {
  profile: Profile;
  stats: ProfileStats;
  severity: SeverityStats;
  badges: ProfileBadge[];
}

// Real shape of GET/PATCH /api/v1/user-profiles/me (confirmed against the live
// OpenAPI spec at devsolve-api.quizzy.it.com/v3/api-docs). The backend has no
// public username lookup, no badges/hacktivity/community/thanks/following
// endpoints — only the signed-in user's own profile.
interface UserProfileApiResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  biography?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  country?: string;
  status?: "ACTIVE" | "SUSPENDED" | "REMOVED";
  socialLinks?: { platform: "GITHUB" | "LINKEDIN" | "WEBSITE" | "X" | "FACEBOOK" | "TELEGRAM" | "OTHER"; url: string }[];
  reputation?: number;
  totalReports?: number;
  validReports?: number;
  criticalReports?: number;
  recognitionCount?: number;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Real shape of GET /api/v1/reports/mine content items (per the live OpenAPI
// spec). No program/organization display name is included anywhere on this
// object — only programId — so it has to be resolved separately per report.
interface ReportApiResponse {
  id: string;
  programId: string;
  severity?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  state: "NEW" | "TRIAGING" | "NEEDS_MORE_INFO" | "VALID_CONFIRMED" | "RESOLVED" | "REJECTED" | "DUPLICATE";
  rewards?: { amount: number }[];
  submittedAt?: string;
  resolvedAt?: string;
}

// Real shape of GET /api/v1/programs/{id} — only the fields used to enrich
// a hacktivity entry with a display name.
interface ProgramApiResponse {
  id: string;
  name: string;
}

// Real shape of GET /api/v1/problems/mine content items. There's no distinct
// "Solutions" or "Discussion" post type on the backend — those are solutions
// and comments attached to a problem, not standalone posts — so only problems
// map cleanly onto CommunityPost's card shape (title/description/votes/views).
interface ProblemApiResponse {
  id: string;
  title: string;
  description?: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "RESOLVED" | "CLOSED" | "REJECTED";
  viewCount?: number;
  publishedAt?: string;
  createdAt?: string;
}

// Real shape of GET /api/v1/votes/{type}/{targetId}/summary — `score` is the
// net (upvotes - downvotes) count, which is what the vote-count UI expects.
interface VoteSummaryApiResponse {
  score?: number;
}

// socialLinks comes back as a flat platform/url array — map the platforms our
// UI actually has fields for onto SocialLinksForm. "X" is the platform's name
// for what our UI calls "twitter". FACEBOOK/TELEGRAM/OTHER have no field in
// this app's UI (see ProfileBio.tsx, BioSocialSection.tsx) so they're dropped
// on read; toSocialLinksPayload only ever writes the four platforms below, so
// a link stored under one of those unsupported platforms elsewhere would be
// silently omitted the next time this app saves — same as before this app had
// any real social-links support at all.
function socialLinksOf(raw: UserProfileApiResponse): SocialLinksForm {
  const links = raw.socialLinks ?? [];
  const urlFor = (platform: string) => links.find((link) => link.platform === platform)?.url ?? "";
  return {
    github: urlFor("GITHUB"),
    twitter: urlFor("X"),
    linkedin: urlFor("LINKEDIN"),
    website: urlFor("WEBSITE"),
  };
}

function toSocialLinksPayload(form: SocialLinksForm | undefined): { platform: string; url: string }[] | undefined {
  if (!form) return undefined;
  const entries: { platform: string; url: string }[] = [];
  if (form.github) entries.push({ platform: "GITHUB", url: form.github });
  if (form.twitter) entries.push({ platform: "X", url: form.twitter });
  if (form.linkedin) entries.push({ platform: "LINKEDIN", url: form.linkedin });
  if (form.website) entries.push({ platform: "WEBSITE", url: form.website });
  return entries;
}

function initialsOf(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || mockProfile.avatarInitials
  );
}

function fullNameOf(raw: UserProfileApiResponse, fallback: string): string {
  return raw.fullName || [raw.firstName, raw.lastName].filter(Boolean).join(" ") || fallback;
}

function usernameOf(raw: UserProfileApiResponse, fallback: string): string {
  return raw.email ? raw.email.split("@")[0] : fallback;
}

function memberSinceOf(iso: string | undefined, fallback: string): string {
  const date = iso ? new Date(iso) : null;
  if (!date || Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function acceptedRateOf(total: number, valid: number): number {
  return total > 0 ? Math.round((valid / total) * 1000) / 10 : 0;
}

// Derives the severity-breakdown bars and rejected/duplicate/retest counters
// from the user's own reports (GET /reports/mine) — there's no dedicated
// stats-breakdown endpoint, so this is computed client-side. Rejected/duplicate
// reports are counted separately from the severity bars rather than double
// counted. There's no retest endpoint at all yet, so `retests` is always 0 —
// a real "nothing tracked" rather than a fabricated placeholder count.
function severityStatsOf(reports: ReportApiResponse[]): SeverityStats {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, rejected: 0, duplicate: 0 };
  for (const report of reports) {
    if (report.state === "REJECTED") counts.rejected += 1;
    else if (report.state === "DUPLICATE") counts.duplicate += 1;
    else if (report.severity === "CRITICAL") counts.critical += 1;
    else if (report.severity === "HIGH") counts.high += 1;
    else if (report.severity === "MEDIUM") counts.medium += 1;
    else if (report.severity === "LOW") counts.low += 1;
  }
  return { ...counts, retests: 0 };
}

function totalEarnedOf(reports: ReportApiResponse[]): number {
  return reports.reduce((sum, report) => sum + (report.rewards?.reduce((s, reward) => s + (reward.amount ?? 0), 0) ?? 0), 0);
}

// Shared by toProfileOverview and getAccountStatus so the submission/accepted
// counts shown on the profile page and the Settings sidebar can't drift apart.
// raw.totalReports/validReports are trusted when present; reports.length is
// only a fallback for when the profile response omits them.
function reportCountsOf(raw: UserProfileApiResponse, reports: ReportApiResponse[]) {
  const total = raw.totalReports ?? reports.length;
  const valid = raw.validReports ?? reports.filter((r) => r.state === "RESOLVED" || r.state === "VALID_CONFIRMED").length;
  return { total, valid };
}

function toProfileOverview(
  raw: UserProfileApiResponse,
  social: { followers: number; following: number },
  reports: ReportApiResponse[]
): ProfileOverviewResponse {
  const displayName = fullNameOf(raw, mockProfile.displayName);
  const { total: totalReports, valid: validReports } = reportCountsOf(raw, reports);

  const profile: Profile = {
    ...mockProfile,
    id: raw.id ?? mockProfile.id,
    username: usernameOf(raw, mockProfile.username),
    displayName,
    avatarInitials: initialsOf(displayName),
    avatarUrl: raw.avatarUrl,
    bio: raw.biography || mockProfile.bio,
    location: raw.country || mockProfile.location,
    memberSince: memberSinceOf(raw.createdAt, mockProfile.memberSince),
    socialLinks: socialLinksOf(raw),
    followers: social.followers,
    following: social.following,
    phone: raw.phone,
    dateOfBirth: raw.dateOfBirth,
    gender: raw.gender,
  };

  const stats: ProfileStats = {
    reputation: raw.reputation ?? 0,
    // No leaderboard/rank endpoint exists yet — omitted rather than faked.
    globalRank: undefined,
    reportsSubmitted: totalReports,
    accepted: validReports,
    acceptedRate: acceptedRateOf(totalReports, validReports),
    totalEarned: totalEarnedOf(reports),
  };

  const severity = severityStatsOf(reports);

  // No badges endpoint exists yet — an empty grid is honest; the mock badge
  // set was fabricated achievement data with no backing from the backend.
  return { profile, stats, severity, badges: [] };
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // The `username` arg is accepted for route compatibility but ignored —
    // the backend only exposes the signed-in user's own profile. Also pulls the
    // real followers/following counts from the follows API (size=1 just to read
    // the `totalElements` pagination field cheaply) instead of the mock 284/61,
    // and the user's reports to derive the Overview tab's stats/severity
    // breakdown (see toProfileOverview) instead of mock numbers.
    getProfileByUsername: builder.query<ProfileOverviewResponse, string>({
      async queryFn(_username, _api, _extraOptions, fetchWithBQ) {
        const profileResult = await fetchWithBQ(`/user-profiles/me`);
        if (profileResult.error) return { error: profileResult.error };
        const raw = profileResult.data as UserProfileApiResponse;

        const [followingResult, followersResult, reportsResult] = await Promise.all([
          fetchWithBQ(`/follows/mine?size=1`),
          fetchWithBQ(`/follows/USER/${raw.id}/followers?size=1`),
          fetchWithBQ(`/reports/mine?size=100`),
        ]);

        const followingCount = !followingResult.error
          ? (followingResult.data as { totalElements?: number } | undefined)?.totalElements
          : undefined;
        const followersCount = !followersResult.error
          ? (followersResult.data as { totalElements?: number } | undefined)?.totalElements
          : undefined;
        const reports = !reportsResult.error
          ? (reportsResult.data as { content?: ReportApiResponse[] } | undefined)?.content ?? []
          : [];

        return {
          data: toProfileOverview(
            raw,
            {
              followers: followersCount ?? mockProfile.followers,
              following: followingCount ?? mockProfile.following,
            },
            reports
          ),
        };
      },
      providesTags: ["Profile"],
    }),

    // Built from GET /reports/mine — same "me only" constraint as the rest of
    // this file, so this reflects the signed-in user's own reports regardless
    // of the `username` arg. There's still no badges, leaderboard/rank, or
    // retest endpoint, so only "resolved" entries (from reports whose state is
    // RESOLVED) are emitted — badge/rank/retest hacktivity types have no real
    // data source yet and are intentionally omitted rather than faked.
    getHacktivity: builder.query<HacktivityEntry[], string>({
      async queryFn(username, _api, _extraOptions, fetchWithBQ) {
        const reportsResult = await fetchWithBQ(`/reports/mine?size=50&sort=submittedAt,DESC`);
        if (reportsResult.error) return { error: reportsResult.error };

        const resolved = (
          (reportsResult.data as { content?: ReportApiResponse[] } | undefined)?.content ?? []
        ).filter((report) => report.state === "RESOLVED");

        const programIds = Array.from(new Set(resolved.map((report) => report.programId).filter(Boolean)));
        const programResults = await Promise.all(programIds.map((id) => fetchWithBQ(`/programs/${id}`)));
        const programNames = new Map<string, string>();
        programIds.forEach((id, index) => {
          const result = programResults[index];
          if (!result.error) programNames.set(id, (result.data as ProgramApiResponse).name);
        });

        const entries: HacktivityEntry[] = resolved
          .map((report) => ({
            id: report.id,
            type: "resolved" as const,
            actorHandle: `@${username}`,
            date: report.resolvedAt || report.submittedAt || new Date().toISOString(),
            severity: report.severity && report.severity !== "NONE" ? (report.severity.toLowerCase() as Severity) : undefined,
            program: programNames.get(report.programId) ?? "Unknown Program",
            bounty: report.rewards?.length ? report.rewards.reduce((sum, reward) => sum + (reward.amount ?? 0), 0) : undefined,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { data: entries };
      },
      providesTags: ["Profile"],
    }),

    // Built from GET /problems/mine (same "me only" constraint as the rest of
    // this file). Only PUBLISHED/RESOLVED/CLOSED problems are shown — drafts,
    // pending-approval, and rejected problems aren't real community content.
    // Every entry is tagged "Problem": there's no backend concept of a
    // standalone "Solutions" or "Discussion" post (solutions and comments are
    // attached to a problem, not their own card), so those tags are never
    // emitted rather than faked. Votes and answer counts require a per-problem
    // lookup since neither is embedded in ProblemResponse.
    getCommunityPosts: builder.query<CommunityPost[], string>({
      async queryFn(_username, _api, _extraOptions, fetchWithBQ) {
        const problemsResult = await fetchWithBQ(`/problems/mine?size=20`);
        if (problemsResult.error) return { error: problemsResult.error };

        const visible = (
          (problemsResult.data as { content?: ProblemApiResponse[] } | undefined)?.content ?? []
        ).filter((problem) => problem.status === "PUBLISHED" || problem.status === "RESOLVED" || problem.status === "CLOSED");

        const enrichment = await Promise.all(
          visible.map((problem) =>
            Promise.all([
              fetchWithBQ(`/votes/PROBLEM/${problem.id}/summary`),
              fetchWithBQ(`/problems/${problem.id}/solutions?pageSize=1`),
            ])
          )
        );

        const posts: CommunityPost[] = visible
          .map((problem, index) => {
            const [voteResult, solutionsResult] = enrichment[index];
            const votes = !voteResult.error ? (voteResult.data as VoteSummaryApiResponse | undefined)?.score ?? 0 : 0;
            const answers = !solutionsResult.error
              ? (solutionsResult.data as { totalElements?: number } | undefined)?.totalElements ?? 0
              : 0;

            return {
              id: problem.id,
              title: problem.title,
              description: problem.description ?? "",
              tag: "Problem" as const,
              votes,
              answers,
              views: problem.viewCount ?? 0,
              isSolved: problem.status === "RESOLVED",
              date: problem.publishedAt || problem.createdAt || new Date().toISOString(),
            };
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { data: posts };
      },
      providesTags: ["Profile"],
    }),

    // No backend endpoint yet — mocked until a hall-of-thanks API exists.
    getThanks: builder.query<ThanksEntry[], string>({
      queryFn: () => ({ data: mockThanks }),
      providesTags: ["Profile"],
    }),

    getEditProfileForm: builder.query<EditProfileFormData, void>({
      query: () => `/user-profiles/me`,
      transformResponse: (raw: UserProfileApiResponse): EditProfileFormData => {
        const fullName = fullNameOf(raw, mockEditProfileFormData.fullName);
        return {
          ...mockEditProfileFormData,
          fullName,
          avatarInitials: initialsOf(fullName),
          avatarUrl: raw.avatarUrl || undefined,
          username: usernameOf(raw, mockEditProfileFormData.username),
          email: raw.email || mockEditProfileFormData.email,
          bio: raw.biography || mockEditProfileFormData.bio,
          location: raw.country || mockEditProfileFormData.location,
          phone: raw.phone || "",
          dateOfBirth: raw.dateOfBirth || "",
          gender: raw.gender,
          socialLinks: socialLinksOf(raw),
        };
      },
      providesTags: ["Profile"],
    }),

    // firstName/lastName/biography/phone/avatarUrl/dateOfBirth/gender/country
    // are real, persisted fields (per UpdateUserProfileRequest). username, email,
    // socialLinks, 2FA, and notification prefs have no backend support yet and are
    // kept client-side only.
    updateProfile: builder.mutation<EditProfileFormData, Partial<EditProfileFormData>>({
      query: (body) => {
        const [firstName, ...rest] = (body.fullName ?? "").trim().split(/\s+/).filter(Boolean);
        return {
          url: `/user-profiles/me`,
          method: "PATCH",
          body: {
            firstName: firstName || undefined,
            lastName: rest.join(" ") || undefined,
            biography: body.bio,
            country: body.location,
            phone: body.phone || undefined,
            avatarUrl: body.avatarUrl || undefined,
            dateOfBirth: body.dateOfBirth || undefined,
            gender: body.gender || undefined,
            socialLinks: toSocialLinksPayload(body.socialLinks),
          },
        };
      },
      transformResponse: (raw: UserProfileApiResponse, _meta, arg): EditProfileFormData => {
        const fullName = fullNameOf(raw, arg.fullName || mockEditProfileFormData.fullName);
        return {
          ...mockEditProfileFormData,
          ...arg,
          fullName,
          avatarInitials: initialsOf(fullName),
          avatarUrl: raw.avatarUrl ?? arg.avatarUrl,
          email: raw.email || arg.email || mockEditProfileFormData.email,
          bio: raw.biography ?? arg.bio ?? mockEditProfileFormData.bio,
          location: raw.country ?? arg.location ?? mockEditProfileFormData.location,
          phone: raw.phone ?? arg.phone ?? "",
          dateOfBirth: raw.dateOfBirth ?? arg.dateOfBirth ?? "",
          gender: raw.gender ?? arg.gender,
          socialLinks: socialLinksOf(raw),
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Same totalSubmissions/acceptedReports derivation as toProfileOverview
    // (via reportCountsOf) so the Settings sidebar never disagrees with the
    // main profile page's numbers.
    getAccountStatus: builder.query<AccountStatus, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [profileResult, reportsResult] = await Promise.all([
          fetchWithBQ(`/user-profiles/me`),
          fetchWithBQ(`/reports/mine?size=100`),
        ]);
        if (profileResult.error) return { error: profileResult.error };
        const raw = profileResult.data as UserProfileApiResponse;
        const reports = !reportsResult.error
          ? (reportsResult.data as { content?: ReportApiResponse[] } | undefined)?.content ?? []
          : [];

        const { total, valid } = reportCountsOf(raw, reports);
        return {
          data: {
            memberSince: memberSinceOf(raw.createdAt, mockProfile.memberSince),
            totalSubmissions: total,
            acceptedReports: valid,
            reputationPoints: raw.reputation ?? 0,
            acceptanceRate: acceptedRateOf(total, valid),
            phone: raw.phone,
            dateOfBirth: raw.dateOfBirth,
            gender: raw.gender,
          },
        };
      },
      providesTags: ["Profile"],
    }),

    // GET /api/v1/follows/mine — always the signed-in user's own follows (same
    // "me only" constraint as /user-profiles/me). Fetched at a large page size
    // so the counts pills reflect what's actually in the list rather than just
    // the first page; there's no documented filter-by-type query param yet.
    getMyFollows: builder.query<{ counts: FollowingCounts; items: FollowRecord[] }, void>({
      query: () => `/follows/mine?size=100`,
      transformResponse: (raw: { content?: FollowRecord[] }) => {
        const items = raw.content ?? [];
        const counts: FollowingCounts = { hackers: 0, orgs: 0, topics: 0 };
        for (const item of items) {
          if (item.followableType === "USER") counts.hackers += 1;
          else if (item.followableType === "ORGANIZATION") counts.orgs += 1;
          else counts.topics += 1;
        }
        return { counts, items };
      },
      providesTags: ["Profile"],
    }),

    // GET /api/v1/follows/{type}/{targetId}/followers — who follows a given
    // followable target. Takes the target's real user id (from getProfileByUsername's
    // `profile.id`, itself sourced from /user-profiles/me) rather than a username,
    // since the backend has no username-based lookup.
    getFollowers: builder.query<{ total: number; items: FollowRecord[] }, string>({
      query: (userId) => `/follows/USER/${userId}/followers?size=100`,
      transformResponse: (raw: { content?: FollowRecord[]; totalElements?: number }) => {
        const items = raw.content ?? [];
        return { total: raw.totalElements ?? items.length, items };
      },
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileByUsernameQuery,
  useGetHacktivityQuery,
  useGetCommunityPostsQuery,
  useGetThanksQuery,
  useGetEditProfileFormQuery,
  useUpdateProfileMutation,
  useGetAccountStatusQuery,
  useGetMyFollowsQuery,
  useGetFollowersQuery,
} = profileApi;