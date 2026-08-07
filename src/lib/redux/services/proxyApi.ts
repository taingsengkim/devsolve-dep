import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Endpoints that go through the Next route handlers under `src/app/api/*`
 * rather than straight to the backend origin.
 *
 * `baseApi` cannot be reused for these: its `baseUrl` is the backend, so a
 * relative `/categories` would be joined onto it and skip the proxy entirely.
 * Nothing here injects a bearer token — the route handler reads the session
 * cookie and attaches the JWT server-side, which is the whole point.
 */
export const proxyApi = createApi({
  reducerPath: "proxyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category"],
  endpoints: () => ({}),
});
