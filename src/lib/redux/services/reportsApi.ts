import { baseApi } from "./baseApi";

export interface ReportItem {
  id: string;
  reportId: string;
  title: string;
  program: string;
  avatarLetter: string;
  type: "Bounty" | "Response";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "TRIAGING" | "RESOLVED" | "ACCEPTED" | "SUBMITTED" | "REJECTED";
  bountyOrRep: string;
  isBountyHighlight?: boolean;
  isBountyDim?: boolean;
  lastActivityDate: string;
  lastActivityBadge: string;
}

export interface ReportsFilterParams {
  search?: string;
  status?: string;
  severity?: string;
}

// Initial mock dataset for reports matching the prompt specs
const MOCK_REPORTS: ReportItem[] = [
  {
    id: "1",
    reportId: "RPT-2847",
    title: "SQL Injection in /api/v1/users",
    program: "FinStream Bug Bounty",
    avatarLetter: "U",
    type: "Bounty",
    severity: "CRITICAL",
    status: "TRIAGING",
    bountyOrRep: "$1,500.00",
    isBountyHighlight: true,
    lastActivityDate: "Oct 24, 2023",
    lastActivityBadge: "NEW COMMENT",
  },
  {
    id: "2",
    reportId: "RPT-2791",
    title: "Broken Access Control on Admin Panel",
    program: "GlobalRoute Pro",
    avatarLetter: "U",
    type: "Bounty",
    severity: "HIGH",
    status: "RESOLVED",
    bountyOrRep: "$1,500.00",
    isBountyHighlight: true,
    lastActivityDate: "Oct 20, 2023",
    lastActivityBadge: "PAYMENT ISSUED",
  },
  {
    id: "3",
    reportId: "RPT-2755",
    title: "Stored XSS in Comment Section",
    program: "CloudStore VDP",
    avatarLetter: "U",
    type: "Response",
    severity: "MEDIUM",
    status: "ACCEPTED",
    bountyOrRep: "Reputation",
    lastActivityDate: "Oct 15, 2023",
    lastActivityBadge: "STATUS UPDATE",
  },
  {
    id: "4",
    reportId: "RPT-2740",
    title: "Information Disclosure via Debug Header",
    program: "HealthSync Portal",
    avatarLetter: "U",
    type: "Bounty",
    severity: "LOW",
    status: "SUBMITTED",
    bountyOrRep: "$150.00",
    lastActivityDate: "Oct 12, 2023",
    lastActivityBadge: "RECEIVED",
  },
  {
    id: "5",
    reportId: "RPT-2702",
    title: "CSRF on Profile Settings",
    program: "CyberShield Dashboard",
    avatarLetter: "U",
    type: "Bounty",
    severity: "HIGH",
    status: "REJECTED",
    bountyOrRep: "$0.00",
    isBountyDim: true,
    lastActivityDate: "Oct 05, 2023",
    lastActivityBadge: "CLOSURE",
  },
];

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
  }),
});

export const { useGetReportsQuery } = reportsApi;
