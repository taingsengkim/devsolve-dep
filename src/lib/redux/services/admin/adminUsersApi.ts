import { baseApi } from "../baseApi";
import {
  PageAdminUserSummaryResponse,
  GetAdminUsersParams,
} from "@/lib/types/admin/types";


export interface CreateModerationActionParams {
  id: string;
  action: "WARN" | "SUSPEND" | "REMOVE" | "BAN";
  reason: string;
  expiresAt?: string;
}

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<PageAdminUserSummaryResponse, GetAdminUsersParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.query) searchParams.set("query", params.query);
        if (params?.status && params.status !== "ALL") searchParams.set("status", params.status);
        if (typeof params?.pageNumber === "number") searchParams.set("pageNumber", String(params.pageNumber));
        if (typeof params?.pageSize === "number") searchParams.set("pageSize", String(params.pageSize));

        const qs = searchParams.toString();
        return `/admin/users${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["AdminUser"],
    }),
    createAdminModerationAction: builder.mutation<
      unknown,
      CreateModerationActionParams
    >({
      query: ({ id, action, reason, expiresAt }) => ({
        url: `/admin/${id}/moderation-actions`,
        method: "POST",
        body: { action, reason, expiresAt },
      }),
      invalidatesTags: ["AdminUser"],
    }),
    updateAdminUserStatus: builder.mutation<
      unknown,
      { id: string; status: "ACTIVE" | "SUSPENDED" | "PENDING"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/admin/${id}/moderation-actions`,
        method: "POST",
        body: {
          action: status === "ACTIVE" ? "ACTIVATE" : status === "SUSPENDED" ? "SUSPEND" : "WARN",
          reason: reason || `Account status set to ${status} via Admin Users dashboard.`,
        },
      }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useCreateAdminModerationActionMutation,
  useUpdateAdminUserStatusMutation,
} = adminUsersApi;
