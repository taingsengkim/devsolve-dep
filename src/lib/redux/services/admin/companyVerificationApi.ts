import { baseApi } from "../baseApi";
import {
  PendingOrganizationsResponse,
  OrganizationResponse,
  OrganizationReviewHistoryItem,
  PaginatedResponse,
} from "@/lib/types/admin/types";

export const companyVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      providesTags: ["CompanyVerification"],
    }),

    getAdminOrganizations: builder.query<
      PendingOrganizationsResponse | PaginatedResponse<OrganizationResponse>,
      { status?: string; pageNumber?: number; pageSize?: number } | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {
          pageNumber: params?.pageNumber ?? 0,
          pageSize: params?.pageSize ?? 100,
        };
        if (params?.status) queryParams.status = params.status;
        return {
          url: "/admin/organizations",
          params: queryParams,
        };
      },
      providesTags: ["CompanyVerification"],
    }),

    getOrganizationById: builder.query<OrganizationResponse, string>({
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
        "CompanyVerification",
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
        "CompanyVerification",
      ],
    }),

    getOrganizationReviewHistory: builder.query<OrganizationReviewHistoryItem[], string>({
      query: (id) => ({
        url: `/admin/organizations/${id}/review-history`,
      }),
      providesTags: (_result, _error, id) => [{ type: "CompanyVerification", id }],
    }),
  }),
});

export const {
  useGetPendingOrganizationsQuery,
  useGetAdminOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useApproveOrganizationMutation,
  useRejectOrganizationMutation,
  useGetOrganizationReviewHistoryQuery,
} = companyVerificationApi;

