import { proxyApi } from "./proxyApi";
import type { DashboardOverviewResponse } from "@/lib/types/dashboard/types";

export * from "@/lib/types/dashboard/types";

export type DashboardAudience = "company" | "user";

export const dashboardApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<
      DashboardOverviewResponse,
      { view: DashboardAudience }
    >({
      query: ({ view }) => ({
        url: "/dashboard/overview",
        method: "GET",
        params: { view },
      }),
      providesTags: ["Report", "Program", "Organization"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
