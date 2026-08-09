import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { clearAccessToken, getAccessToken } from "@/lib/auth/access-token";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: async (headers) => {
    // The token lives with better-auth against the session cookie, not in
    // localStorage — asking the client for it is the only way to get one.
    const token = await getAccessToken();
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * A token that expired between cache and send comes back as a 401. Drop the
 * cached copy so better-auth mints a fresh one, then replay the request once.
 * A second 401 is a real authorization failure and is passed through.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearAccessToken();
    return rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "/api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Program",
    "Report",
    "Bounty",
    "Discussion",
    "Bookmark",
    "Profile",
    "User",
    "Organization",
    "OrganizationVerification",
    "OrganizationMember",
    "OrganizationMembers",
    "OrganizationInvitations",
    "Profile",
    "Report",
    "Bookmark",
    "Post",
    "Notification",
    "CompanyVerification",
    "AdminUser",
    "ModerationItem",
    "ContentReport",
    "AdminUser",
    "ModerationAction",
    "Showcase",
    "ShowcaseStep",
    "ShowcaseRevision",
    "ShowcaseReview",
    "Problem",
    "ProblemReview",
    "Solution",
    "Category",
    "Vote",
    "Comment",
    "AdminProgram",
    "AdminProblem",
    "AdminSolution",
  ],
  endpoints: () => ({}),
});
