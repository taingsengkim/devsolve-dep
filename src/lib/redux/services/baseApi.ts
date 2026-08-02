import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authClient } from "@/lib/auth/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: async (headers) => {
      // Get the Keycloak access token from Better Auth (auto-refreshes if expired)
      const result = await authClient.getAccessToken({
        providerId: "keycloak",
      });

      if (result?.data?.accessToken) {
        headers.set("Authorization", `Bearer ${result.data.accessToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User", "Post", "Report", "Program", "CompanyVerification", "ContentReport", "ModerationItem", "AdminUser", "Notification", "Bookmark", "Profile", "Discussion"],
  endpoints: () => ({}),
});
