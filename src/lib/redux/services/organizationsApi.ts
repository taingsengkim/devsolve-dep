import { baseApi } from "./baseApi";

export type OrganizationStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | (string & {});

export type OrganizationIndustry =
  | "TECHNOLOGY"
  | "FINANCE"
  | "HEALTHCARE"
  | "ECOMMERCE"
  | "GOVERNMENT"
  | "EDUCATION"
  | "OTHER"
  | (string & {});

export type Organization = {
  id: string;
  ownerId?: string;
  name: string;
  slug?: string;
  domain?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
  industry?: OrganizationIndustry;
  companySize?: string;
  country?: string;
  status: OrganizationStatus;
  submissionVersion?: number;
  rejectionReason?: string;
  reviewedAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type OrganizationVerification = {
  organizationId?: string;
  organizationName?: string;
  email?: string;
  emailVerified?: boolean;
  domain?: string;
  domainVerified?: boolean;
  status?: OrganizationStatus;
  nextAction?: string;
  rejectionReason?: string;
  [key: string]: unknown;
};

export type RegisterOrganizationRequest = {
  fullName: string;
  jobTitle: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  industry: OrganizationIndustry;
  companySize: string;
  country: string;
  joiningReason: string;
};

export type UpdateOrganizationRequest = {
  name?: string;
  domain?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
  industry?: OrganizationIndustry;
  companySize?: string;
  country?: string;
};

export type OrganizationInvitationRole = "MANAGER" | "MEMBER" | "VIEWER";
export type OrganizationInvitationPermission =
  | "VIEW_PROGRAMS"
  | "CREATE_PROGRAM"
  | "EDIT_PROGRAM"
  | "MANAGE_PROGRAM_STATE"
  | "VIEW_REPORTS"
  | "TRIAGE_REPORTS"
  | "MANAGE_DISCLOSURE"
  | "AWARD_REWARDS";

export type OrganizationMemberInvitationStatus =
  | "ACTIVE"
  | "PENDING"
  | (string & {});

export type InviteOrganizationMemberRequest = {
  email: string;
  role: OrganizationInvitationRole;
  permissions: OrganizationInvitationPermission[];
};

export type UpdateMemberRoleRequest = {
  userId: string;
  role: OrganizationInvitationRole;
};

export type UpdateMemberPermissionsRequest = {
  userId: string;
  permissions: OrganizationInvitationPermission[];
};

export type RemoveMemberRequest = {
  userId: string;
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
    registerOrganization: builder.mutation<
      Organization,
      RegisterOrganizationRequest
    >({
      query: (body) => ({
        url: "/organizations/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),
    getMyOrganization: builder.query<Organization, void>({
      query: () => ({
        url: "/organizations/me",
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),
    updateMyOrganization: builder.mutation<
      Organization,
      UpdateOrganizationRequest
    >({
      query: (body) => ({
        url: "/organizations/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),
    deleteMyOrganization: builder.mutation<void, void>({
      query: () => ({
        url: "/organizations/me",
        method: "DELETE",
      }),
      invalidatesTags: ["Organization", "OrganizationMembers"],
    }),
    getOrganizationVerification: builder.query<OrganizationVerification, void>({
      query: () => ({
        url: "/organizations/me/verification",
        method: "GET",
      }),
      providesTags: ["OrganizationVerification", "Organization"],
    }),
    sendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: "/organizations/me/verification-email",
        method: "POST",
      }),
      invalidatesTags: ["OrganizationVerification", "Organization"],
    }),
    resubmitOrganization: builder.mutation<Organization, void>({
      query: () => ({
        url: "/organizations/me/resubmit",
        method: "POST",
      }),
      invalidatesTags: ["OrganizationVerification", "Organization"],
    }),
    getOrganizationById: builder.query<Organization, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Organization", id }],
    }),
    getOrganizationBySlug: builder.query<Organization, string>({
      query: (slug) => ({
        url: `/organizations/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_result, _error, slug) => [{ type: "Organization", id: slug }],
    }),
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
    updateMemberRole: builder.mutation<
      OrganizationInvitationMember,
      UpdateMemberRoleRequest
    >({
      query: ({ userId, role }) => ({
        url: `/organizations/me/members/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["OrganizationMembers"],
    }),
    updateMemberPermissions: builder.mutation<
      OrganizationInvitationMember,
      UpdateMemberPermissionsRequest
    >({
      query: ({ userId, permissions }) => ({
        url: `/organizations/me/members/${userId}/permissions`,
        method: "PATCH",
        body: { permissions },
      }),
      invalidatesTags: ["OrganizationMembers"],
    }),
    removeMember: builder.mutation<void, RemoveMemberRequest>({
      query: ({ userId }) => ({
        url: `/organizations/me/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrganizationMembers"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterOrganizationMutation,
  useGetMyOrganizationQuery,
  useUpdateMyOrganizationMutation,
  useDeleteMyOrganizationMutation,
  useGetOrganizationVerificationQuery,
  useSendVerificationEmailMutation,
  useResubmitOrganizationMutation,
  useGetOrganizationByIdQuery,
  useGetOrganizationBySlugQuery,
  useGetOrganizationMembersQuery,
  useInviteOrganizationMemberMutation,
  useAcceptOrganizationInvitationMutation,
  useUpdateMemberRoleMutation,
  useUpdateMemberPermissionsMutation,
  useRemoveMemberMutation,
} = organizationsApi;
