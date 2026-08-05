import { baseApi } from "../baseApi";
import {
  CompanyVerificationItem,
  PendingOrganizationsResponse,
} from "@/lib/types/admin/types";
import {
  mockCompanyVerificationsStore,
  updateMockCompanyVerificationsStore,
} from "./adminMockData";

export const companyVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Real API endpoint ────────────────────────────────────────────────
    getPendingOrganizations: builder.query<
      PendingOrganizationsResponse,
      { pageNumber?: number; pageSize?: number }
    >({
      query: ({ pageNumber = 0, pageSize = 20 } = {}) => ({
        url: "/admin/organizations/pending",
        params: { pageNumber, pageSize },
      }),
      providesTags: ["CompanyVerification"],
    }),
    // ─────────────────────────────────────────────────────────────────────
    getCompanyVerifications: builder.query<CompanyVerificationItem[], void>({
      queryFn: () => {
        return { data: mockCompanyVerificationsStore.map((c) => ({ ...c })) };
      },
      providesTags: ["CompanyVerification"],
    }),
    getCompanyVerificationById: builder.query<CompanyVerificationItem, string>({
      queryFn: (id) => {
        const found = mockCompanyVerificationsStore.find((c) => c.id === id);
        if (found) return { data: { ...found } };
        return { data: { ...mockCompanyVerificationsStore[0] } };
      },
      providesTags: (_result, _error, id) => [{ type: "CompanyVerification", id }],
    }),
    updateCompanyVerificationStatus: builder.mutation<
      CompanyVerificationItem,
      { id: string; status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; notes?: string }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status, notes }) => {
        updateMockCompanyVerificationsStore((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status, ...(notes ? { notes } : {}) } : c))
        );
        const updated = mockCompanyVerificationsStore.find((c) => c.id === id);
        return { data: updated ? { ...updated } : { ...mockCompanyVerificationsStore[0] } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "CompanyVerification", id }, "CompanyVerification"],
    }),
  }),
});

export const {
  useGetPendingOrganizationsQuery,
  useGetCompanyVerificationsQuery,
  useGetCompanyVerificationByIdQuery,
  useUpdateCompanyVerificationStatusMutation,
} = companyVerificationApi;
