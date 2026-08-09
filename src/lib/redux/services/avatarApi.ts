import { proxyApi } from "./proxyApi";
import { baseApi } from "./baseApi";

/** The subset of `UserProfileResponse` these two calls are used for. */
export interface AvatarUpdateResponse {
  id: string;
  avatarUrl?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Both endpoints return the whole updated profile, and every profile view in
 * the app is cached under `baseApi`'s `Profile` tag. Since these live on
 * `proxyApi` (they go through the Next route handler rather than straight to
 * the backend), the invalidation has to be dispatched across explicitly —
 * `invalidatesTags` only reaches the slice that owns the tag.
 */
const invalidateProfileEverywhere = async (
  _arg: unknown,
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: (action: unknown) => unknown;
    queryFulfilled: Promise<unknown>;
  },
) => {
  try {
    await queryFulfilled;
    dispatch(baseApi.util.invalidateTags(["Profile"]));
  } catch {
    // A failed upload changed nothing, so the caches are still correct.
  }
};

export const avatarApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    /** PUT /api/user-profiles/me/avatar */
    uploadAvatar: builder.mutation<AvatarUpdateResponse, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file);

        // No explicit Content-Type: the browser has to set the multipart
        // boundary itself, and naming the header here would strip it.
        return { url: "/user-profiles/me/avatar", method: "PUT", body };
      },
      onQueryStarted: invalidateProfileEverywhere,
    }),

    /** DELETE /api/user-profiles/me/avatar */
    removeAvatar: builder.mutation<AvatarUpdateResponse, void>({
      query: () => ({ url: "/user-profiles/me/avatar", method: "DELETE" }),
      onQueryStarted: invalidateProfileEverywhere,
    }),
  }),
  overrideExisting: true,
});

export const { useUploadAvatarMutation, useRemoveAvatarMutation } = avatarApi;
