import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authClient } from "@/lib/auth/auth-client";

interface AccessTokenResult {
  data?: {
    accessToken?: string;
    accessTokenExpiresAt?: string | Date;
  } | null;
}

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;
let pendingAccessToken: Promise<string | null> | null = null;

// The backend (devsolve-api) is a separate origin from this app, so it can't
// read the better-auth session cookie directly — it needs the underlying
// Keycloak access token as a Bearer header instead. better-auth only hands
// that out via getAccessToken(), which is a network round trip, so cache it
// in memory (keyed off its own expiry) rather than refetching on every query.
async function getKeycloakAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedAccessToken && now < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }
  if (pendingAccessToken) return pendingAccessToken;

  pendingAccessToken = authClient
    .getAccessToken({ providerId: "keycloak" })
    .then((res: AccessTokenResult) => {
      const token = res?.data?.accessToken ?? null;
      if (!token) return null;

      cachedAccessToken = token;
      const expiresAt = res.data?.accessTokenExpiresAt
        ? new Date(res.data.accessTokenExpiresAt).getTime()
        : now + 60_000;
      cachedAccessTokenExpiresAt = expiresAt - 10_000; // refresh slightly early
      return token;
    })
    .catch(() => null)
    .finally(() => {
      pendingAccessToken = null;
    });

  return pendingAccessToken;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    prepareHeaders: async (headers) => {
      if (typeof window !== "undefined") {
        const token = await getKeycloakAccessToken();
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Post",
    "Report",
    "Program",
    "CompanyVerification",
    "ContentReport",
    "ModerationItem",
    "AdminUser",
    "Notification",
    "Bookmark",
    "Profile",
    "Discussion",
  ],
  endpoints: () => ({}),
});