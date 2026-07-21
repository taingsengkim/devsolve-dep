import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Custom headers e.g. auth tokens can be added here
      return headers;
    },
  }),
  tagTypes: ["User", "Post"],
  endpoints: () => ({}),
});
