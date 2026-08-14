import { baseApi } from "./baseApi";
import type { FlaggableType, FlagReason } from "@/lib/validations/engagement";

/** Mirrors `CreateFlagRequest`. */
export interface CreateFlagRequest {
  flaggableType: FlaggableType;
  flaggableId: string;
  reason: FlagReason;
  description?: string;
}

/** Mirrors `FlagResponse`, trimmed to what a reporter is shown. */
export interface FlagResponse {
  id: string;
  flaggableType: FlaggableType;
  flaggableId: string;
  reason: FlagReason;
  description?: string;
  status?: "PENDING" | "REVIEWED" | "DISMISSED";
  createdAt?: string;
}

export const flagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /api/v1/flags — report content for moderation.
     *
     * Nothing about the reported item changes for other readers, so no cache
     * tag is invalidated: a flag is a message to the moderators, not an edit.
     */
    createFlag: builder.mutation<FlagResponse, CreateFlagRequest>({
      query: (body) => ({ url: "/flags", method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateFlagMutation } = flagsApi;
