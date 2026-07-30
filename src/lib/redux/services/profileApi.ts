import { baseApi } from "./baseApi";
import { EditProfileFormData, AccountStatus } from "@/lib/types/profile/types";
import { mockEditProfileFormData, mockAccountStatus } from "@/lib/types/profile/mock-data";
import { PasswordFormState } from "@/components/profile/settings/PasswordSection";

export interface ProfileSettingsResponse {
  formData: EditProfileFormData;
  accountStatus: AccountStatus;
}

export interface UpdateProfilePayload {
  formData: EditProfileFormData;
  passwords?: PasswordFormState;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileSettings: builder.query<ProfileSettingsResponse, void>({
      queryFn: () => {
        return {
          data: {
            formData: mockEditProfileFormData,
            accountStatus: mockAccountStatus,
          },
        };
      },
      providesTags: ["User"],
    }),
    updateProfileSettings: builder.mutation<{ success: boolean; message: string }, UpdateProfilePayload>({
      queryFn: async (_payload) => {
        // Mock successful save response until real backend API endpoint is connected
        return {
          data: {
            success: true,
            message: "Profile updated successfully",
          },
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfileSettingsQuery, useUpdateProfileSettingsMutation } = profileApi;
