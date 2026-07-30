import { baseApi } from "./baseApi";
import {
  ReportItem,
  ReportsFilterParams,
  ReportDetail,
  CommentItem,
  SubmitReportPayload,
  SubmitReportResponse,
} from "@/lib/types/reports/types";
import {
  MOCK_REPORTS,
  MOCK_REPORT_DETAIL,
  MOCK_REJECTED_REPORT_DETAIL,
} from "@/lib/types/reports/mock-data";

export * from "@/lib/types/reports/types";
export * from "@/lib/types/reports/mock-data";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportItem[], ReportsFilterParams | void>({
      queryFn: (params) => {
        let results = [...MOCK_REPORTS];

        if (params?.search) {
          const q = params.search.toLowerCase();
          results = results.filter(
            (item) =>
              item.reportId.toLowerCase().includes(q) ||
              item.title.toLowerCase().includes(q) ||
              item.program.toLowerCase().includes(q)
          );
        }

        if (params?.status && params.status !== "All") {
          if (params.status === "Open") {
            results = results.filter(
              (item) => item.status === "TRIAGING" || item.status === "SUBMITTED"
            );
          } else if (params.status === "Resolved") {
            results = results.filter(
              (item) => item.status === "RESOLVED" || item.status === "ACCEPTED" || item.status === "REJECTED"
            );
          } else {
            results = results.filter(
              (item) => item.status.toLowerCase() === params.status?.toLowerCase()
            );
          }
        }

        if (params?.severity && params.severity !== "All" && params.severity !== "Severity: All") {
          results = results.filter(
            (item) => item.severity.toLowerCase() === params.severity?.toLowerCase()
          );
        }

        return { data: results };
      },
      providesTags: ["Report"],
    }),

    getReportById: builder.query<ReportDetail, string>({
      queryFn: (id) => {
        const found = MOCK_REPORTS.find((r) => r.id === id || r.reportId.toLowerCase() === id.toLowerCase());
        if (found?.status === "REJECTED" || id === "5") {
          return { data: MOCK_REJECTED_REPORT_DETAIL };
        }
        if (found) {
          return {
            data: {
              ...MOCK_REPORT_DETAIL,
              id: found.id,
              reportId: found.reportId,
              title: found.title,
              program: found.program,
              severity: found.severity,
              status: found.status,
              bountyOrRep: found.bountyOrRep,
            },
          };
        }
        return { data: MOCK_REPORT_DETAIL };
      },
      providesTags: (_result, _error, id) => [{ type: "Report", id }],
    }),

    addReportComment: builder.mutation<CommentItem, { reportId: string; text: string }>({
      queryFn: ({ text }) => {
        const newComment: CommentItem = {
          id: `c_${Date.now()}`,
          author: "hunter_x_ray",
          avatar: "H",
          isAdmin: false,
          timestamp: "Just now",
          text,
        };
        return { data: newComment };
      },
      invalidatesTags: (_result, _error, { reportId }) => [{ type: "Report", id: reportId }],
    }),

    submitReport: builder.mutation<SubmitReportResponse, SubmitReportPayload>({
      queryFn: (payload) => {
        const numId = MOCK_REPORTS.length + 101;
        const reportId = `#DS-2026-${numId}`;
        const newId = String(Date.now());

        const newReportItem: ReportItem = {
          id: newId,
          reportId: reportId,
          title: payload.title,
          program: payload.programName,
          avatarLetter: payload.programName.slice(0, 1).toUpperCase(),
          type: "Bounty",
          severity: (payload.severity === "INFO" ? "LOW" : payload.severity) as ReportItem["severity"],
          status: "TRIAGING",
          bountyOrRep: "Pending Triage",
          isBountyHighlight: false,
          lastActivityDate: "Just now",
          lastActivityBadge: "Report Submitted",
        };

        MOCK_REPORTS.unshift(newReportItem);

        return {
          data: {
            success: true,
            reportId,
            id: newId,
            message: "Vulnerability report submitted successfully.",
            status: "TRIAGING",
            createdAt: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ["Report"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useAddReportCommentMutation,
  useSubmitReportMutation,
} = reportsApi;
