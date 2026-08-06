import { baseApi } from "./baseApi";

export type OrganizationInvitationRole = "MANAGER" | "MEMBER" | "VIEWER";
export type OrganizationInvitationPermission =
  | "VIEW_PROGRAMS"
  | "CREATE_PROGRAM"
  | "EDIT_PROGRAM"
  | "MANAGE_PROGRAM_STATE"
  | "VIEW_REPORTS"
  | "TRIAGE_REPORTS"
  | "MANAGE_DISCLOSURE"
  | "AWARD_REWARDS"
  | (string & {});

export type OrganizationMemberInvitationStatus =
  | "ACTIVE"
  | "PENDING"
  | (string & {});

export type InviteOrganizationMemberRequest = {
  email: string;
  role: OrganizationInvitationRole;
  permissions: OrganizationInvitationPermission[];
};

export type OrganizationInvitationMember = {
  userId: string;
  name: string;
  email: string;
  role: OrganizationInvitationRole;
  permissions: OrganizationInvitationPermission[];
  status: OrganizationMemberInvitationStatus;
  invitationPending: boolean;
  joinedAt: string;
};

export type InviteOrganizationMemberResponse = {
  member?: OrganizationInvitationMember;
  invitationToken?: string;
  expiresAt?: string;
  [key: string]: unknown;
};

export type AcceptOrganizationInvitationRequest = {
  token: string;
};

type OrganizationMembersEnvelope = {
  members?: OrganizationInvitationMember[];
  data?: OrganizationInvitationMember[];
  items?: OrganizationInvitationMember[];
};

function extractOrganizationMembers(
  response: OrganizationInvitationMember[] | OrganizationMembersEnvelope,
): OrganizationInvitationMember[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.members)) {
    return response.members;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  return [];
}

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembers: builder.query<
      OrganizationInvitationMember[],
      void
    >({
      query: () => ({
        url: "/organizations/me/members",
        method: "GET",
      }),
      transformResponse: (
        response:
          | OrganizationInvitationMember[]
          | OrganizationMembersEnvelope,
      ) => extractOrganizationMembers(response),
      providesTags: ["OrganizationMembers"],
    }),
    inviteOrganizationMember: builder.mutation<
      InviteOrganizationMemberResponse,
      InviteOrganizationMemberRequest
    >({
      query: (body) => ({
        url: "/organizations/me/members/invitations",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "OrganizationMembers",
        "OrganizationInvitations",
      ],
    }),
    acceptOrganizationInvitation: builder.mutation<
      OrganizationInvitationMember,
      AcceptOrganizationInvitationRequest
    >({
      query: ({ token }) => ({
        url: `/organizations/invitations/${token}/accept`,
        method: "POST",
      }),
      invalidatesTags: [
        "OrganizationMembers",
        "OrganizationInvitations",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOrganizationMembersQuery,
  useInviteOrganizationMemberMutation,
  useAcceptOrganizationInvitationMutation,
} = organizationsApi;
