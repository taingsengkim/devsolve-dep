import { baseApi } from "./baseApi";

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}

export const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<HealthCheckResponse, void>({
      query: () => "/health",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetHealthQuery, useLazyGetHealthQuery } = exampleApi;
