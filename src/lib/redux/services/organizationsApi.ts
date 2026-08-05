import { baseApi } from "./baseApi";

export type OrganizationInvitationRole = "MANAGER" | "MEMBER" | "VIEWER";

export type InviteOrganizationMemberRequest = {
  email: string;
  role: OrganizationInvitationRole;
};

export type InviteOrganizationMemberResponse = {
  message?: string;
  email?: string;
  role?: OrganizationInvitationRole;
  token?: string;
  [key: string]: unknown;
};

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteOrganizationMember: builder.mutation<
      InviteOrganizationMemberResponse,
      InviteOrganizationMemberRequest
    >({
      query: (body) => ({
        url: "/organizations/me/members/invitations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization", "OrganizationMember"],
    }),
  }),
});

export const { useInviteOrganizationMemberMutation } = organizationsApi;
