import { baseApi } from "./baseApi";
import {
  Profile,
  ProfileStats,
  SeverityStats,
  ProfileBadge,
  HacktivityEntry,
  CommunityPost,
  ThanksEntry,
  EditProfileFormData,
  AccountStatus,
  FollowingCounts,
  FollowedHacker,
} from "@/lib/types/profile/types";
import {
  mockProfile,
  mockStats,
  mockSeverity,
  mockBadges,
  mockHacktivity,
  mockCommunityPosts,
  mockThanks,
  mockFollowingCounts,
  mockFollowedHackers,
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
  reputation?: number;
  totalReports?: number;
  validReports?: number;
  criticalReports?: number;
  recognitionCount?: number;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
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

function toProfileOverview(raw: UserProfileApiResponse): ProfileOverviewResponse {
  const displayName = fullNameOf(raw, mockProfile.displayName);
  const totalReports = raw.totalReports ?? mockStats.reportsSubmitted;
  const validReports = raw.validReports ?? mockStats.accepted;

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
  };

  const stats: ProfileStats = {
    ...mockStats,
    reputation: raw.reputation ?? mockStats.reputation,
    reportsSubmitted: totalReports,
    accepted: validReports,
    acceptedRate: acceptedRateOf(totalReports, validReports),
  };

  const severity: SeverityStats = {
    ...mockSeverity,
    critical: raw.criticalReports ?? mockSeverity.critical,
  };

  return { profile, stats, severity, badges: mockBadges };
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // The `username` arg is accepted for route compatibility but ignored —
    // the backend only exposes the signed-in user's own profile.
    getProfileByUsername: builder.query<ProfileOverviewResponse, string>({
      query: () => `/user-profiles/me`,
      transformResponse: toProfileOverview,
      providesTags: ["Profile"],
    }),

    // No backend endpoint yet — mocked until an activity-feed API exists.
    getHacktivity: builder.query<HacktivityEntry[], string>({
      queryFn: () => ({ data: mockHacktivity }),
      providesTags: ["Profile"],
    }),

    // No backend endpoint yet — mocked until a community-posts API exists.
    getCommunityPosts: builder.query<CommunityPost[], string>({
      queryFn: () => ({ data: mockCommunityPosts }),
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
          username: usernameOf(raw, mockEditProfileFormData.username),
          email: raw.email || mockEditProfileFormData.email,
          bio: raw.biography || mockEditProfileFormData.bio,
          location: raw.country || mockEditProfileFormData.location,
        };
      },
      providesTags: ["Profile"],
    }),

    // Only firstName/lastName/biography/phone/avatarUrl/dateOfBirth/gender/country
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
          email: raw.email || arg.email || mockEditProfileFormData.email,
          bio: raw.biography ?? arg.bio ?? mockEditProfileFormData.bio,
          location: raw.country ?? arg.location ?? mockEditProfileFormData.location,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    getAccountStatus: builder.query<AccountStatus, void>({
      query: () => `/user-profiles/me`,
      transformResponse: (raw: UserProfileApiResponse): AccountStatus => {
        const totalReports = raw.totalReports ?? mockStats.reportsSubmitted;
        const validReports = raw.validReports ?? mockStats.accepted;
        return {
          memberSince: memberSinceOf(raw.createdAt, mockProfile.memberSince),
          totalSubmissions: totalReports,
          acceptedReports: validReports,
          reputationPoints: raw.reputation ?? mockStats.reputation,
          acceptanceRate: acceptedRateOf(totalReports, validReports),
        };
      },
      providesTags: ["Profile"],
    }),

    // No backend endpoint yet — mocked until a following API exists.
    getFollowingCounts: builder.query<FollowingCounts, string>({
      queryFn: () => ({ data: mockFollowingCounts }),
      providesTags: ["Profile"],
    }),

    // No backend endpoint yet — mocked until a following API exists.
    getFollowedHackers: builder.query<FollowedHacker[], string>({
      queryFn: () => ({ data: mockFollowedHackers }),
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
  useGetFollowingCountsQuery,
  useGetFollowedHackersQuery,
} = profileApi;
