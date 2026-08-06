import { baseApi } from "../baseApi";
import { ReportConfirmationItem } from "@/lib/types/admin/types";
import {
  mockReportConfirmationsStore,
  updateMockReportConfirmationsStore,
} from "./adminMockData";

export const reportConfirmationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportConfirmations: builder.query<ReportConfirmationItem[], void>({
      queryFn: () => {
        return { data: mockReportConfirmationsStore.map((r) => ({ ...r })) };
      },
      providesTags: ["Report"],
    }),
    getReportConfirmationById: builder.query<ReportConfirmationItem, string>({
      queryFn: (id) => {
        const found = mockReportConfirmationsStore.find((r) => r.id === id);
        if (found) return { data: { ...found } };
        return { data: { ...mockReportConfirmationsStore[0] } };
      },
      providesTags: (_result, _error, id) => [{ type: "Report", id }],
    }),
    updateConfirmReport: builder.mutation<
      ReportConfirmationItem,
      {
        id: string;
        status: "CONFIRMED" | "REJECTED" | "ESCALATED";
        severity?: "Critical" | "High" | "Medium" | "Low";
        rewardEstimate?: string;
        rewardAmount?: string;
        companyReasoning?: string;
        triageNotes?: string;
      }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status, severity, rewardEstimate, rewardAmount, companyReasoning, triageNotes }) => {
        updateMockReportConfirmationsStore((prev) =>
          prev.map((r) => {
            if (r.id !== id) return r;
            const updatedAudit = [...(r.auditLog || [])];
            updatedAudit.push({
              id: `al_${Date.now()}`,
              action: `Status set to ${status}`,
              actor: "Admin Triage Officer",
              timestamp: "Just now",
              note: triageNotes || companyReasoning,
            });

            const newSeverity = severity || r.severity;
            const hackerSev = r.hackerClaimedSeverity?.tier || r.severity;
            const agree = hackerSev === newSeverity;

            const updatedConfirmedSeverity = r.companyConfirmedSeverity
              ? { ...r.companyConfirmedSeverity, tier: newSeverity }
              : { tier: newSeverity, cvss: r.cvssVector || "7.0 - 8.9", typicalReward: rewardEstimate || r.rewardEstimate };

            return {
              ...r,
              status,
              severity: newSeverity,
              severitiesAgree: agree,
              companyConfirmedSeverity: updatedConfirmedSeverity,
              ...(rewardEstimate ? { rewardEstimate } : {}),
              ...(rewardAmount ? { rewardAmount } : {}),
              ...(companyReasoning ? { companyReasoning } : {}),
              ...(triageNotes ? { triageNotes } : {}),
              auditLog: updatedAudit,
            };
          })
        );
        const updated = mockReportConfirmationsStore.find((r) => r.id === id);
        return { data: updated ? { ...updated } : { ...mockReportConfirmationsStore[0] } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Report", id }, "Report"],
    }),
  }),
});

export const {
  useGetReportConfirmationsQuery,
  useGetReportConfirmationByIdQuery,
  useUpdateConfirmReportMutation,
} = reportConfirmationApi;
