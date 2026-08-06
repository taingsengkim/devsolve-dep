import { baseApi } from "../baseApi";
import { AdminDashboardOverviewResponse } from "@/lib/types/admin/types";
import { MOCK_ADMIN_OVERVIEW } from "./adminMockData";

export const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminDashboardOverviewResponse, void>({
      queryFn: () => {
        return { data: { ...MOCK_ADMIN_OVERVIEW } };
      },
      providesTags: ["Report", "Program"],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = adminOverviewApi;
