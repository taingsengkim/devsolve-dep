import { proxyApi } from "../proxyApi";
import {
  OrganizationsResponse,
  OrganizationReviewStatus,
  PendingOrganizationsResponse,
  OrganizationResponse,
  OrganizationReviewHistoryItem,
  PaginatedResponse,
} from "@/lib/types/admin/types";

export interface GetOrganizationsParams {
  query?: string;
  status?: OrganizationReviewStatus;
  pageNumber?: number;
  pageSize?: number;
}

export const companyVerificationApi = proxyApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<
      OrganizationsResponse,
      GetOrganizationsParams | void
    >({
      query: (params) => ({
        url: "/admin/organizations",
        params: {
          ...(params?.query ? { query: params.query } : {}),
          ...(params?.status ? { status: params.status } : {}),
          pageNumber: params?.pageNumber ?? 0,
          pageSize: params?.pageSize ?? 20,
        },
      }),
      providesTags: (result) => [
        { type: "CompanyVerification", id: "LIST" },
        ...(result?.content.map(({ id }) => ({
          type: "CompanyVerification" as const,
          id,
        })) ?? []),
      ],
    }),

    getPendingOrganizations: builder.query<
      PendingOrganizationsResponse,
      { pageNumber?: number; pageSize?: number } | void
    >({
      query: (params) => ({
        url: "/admin/organizations/pending",
        params: {
          pageNumber: params?.pageNumber ?? 0,
          pageSize: params?.pageSize ?? 20,
        },
      }),
      providesTags: (result) => [
        { type: "CompanyVerification", id: "PENDING" },
        ...(result?.content.map(({ id }) => ({
          type: "CompanyVerification" as const,
          id,
        })) ?? []),
      ],
    }),

    getAdminOrganizationById: builder.query<OrganizationResponse, string>({
      query: (id) => ({
        url: `/admin/organizations/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "CompanyVerification", id }],
    }),

    approveOrganization: builder.mutation<OrganizationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/organizations/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CompanyVerification", id },
        { type: "CompanyVerification", id: "LIST" },
        { type: "CompanyVerification", id: "PENDING" },
      ],
    }),

    rejectOrganization: builder.mutation<OrganizationResponse, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/organizations/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CompanyVerification", id },
        { type: "CompanyVerification", id: "LIST" },
        { type: "CompanyVerification", id: "PENDING" },
      ],
    }),

    getOrganizationReviewHistory: builder.query<OrganizationReviewHistoryItem[], string>({
      query: (id) => ({
        url: `/admin/organizations/${id}/review-history`,
        params: { pageNumber: 0, pageSize: 100 },
      }),
      transformResponse: (
        response:
          | PaginatedResponse<OrganizationReviewHistoryItem>
          | OrganizationReviewHistoryItem[],
      ) => (Array.isArray(response) ? response : response.content ?? []),
      providesTags: (_result, _error, id) => [{ type: "CompanyVerification", id }],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetPendingOrganizationsQuery,
  useGetAdminOrganizationByIdQuery,
  useApproveOrganizationMutation,
  useRejectOrganizationMutation,
  useGetOrganizationReviewHistoryQuery,
} = companyVerificationApi;

