import { baseApi } from "../baseApi";
import { AdminDashboardOverviewResponse } from "@/lib/types/admin/types";

export const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminDashboardOverviewResponse, void>({
      query: () => "/admin/overview",
      providesTags: ["Report", "Program", "AdminUser", "AdminProblem", "AdminProgram", "ContentReport"],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = adminOverviewApi;

