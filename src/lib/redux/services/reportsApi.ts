import type { ReportResponse } from "@/lib/reports/types";

import { baseApi } from "./baseApi";

type ReportsPayload = ReportResponse[] | { content?: ReportResponse[]; data?: ReportResponse[] };

export const reportsApi = baseApi.injectEndpoints({
  // Next.js Fast Refresh can evaluate this module more than once in development.
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyReports: builder.query<ReportResponse[], void>({
      query: () => "reports/mine",
      transformResponse: (response: ReportsPayload) => {
        if (Array.isArray(response)) return response;
        return response.content ?? response.data ?? [];
      },
      providesTags: (reports) => [
        "Report",
        ...(reports ?? []).map(({ id }) => ({ type: "Report" as const, id })),
      ],
    }),
  }),
});

export const { useGetMyReportsQuery } = reportsApi;
