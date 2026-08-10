import { proxyApi } from "../proxyApi";
import type { AdminOverviewResponse } from "@/lib/types/admin/types";

export const adminOverviewApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      providesTags: ["AdminProgram", "Program", "Organization", "Report"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAdminOverviewQuery } = adminOverviewApi;
