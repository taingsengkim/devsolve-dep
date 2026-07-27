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

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  isAdmin?: boolean;
  timestamp: string;
  text: string;
}

export interface ActivityUpdate {
  id: string;
  actor: string;
  actionText: string;
  statusBadge?: string;
  timestamp: string;
}

export interface ReportDetail extends ReportItem {
  submittedAgo: string;
  claimedSeverity: string;
  confirmedSeverity: string;
  cvssScore: string;
  rewardStatus: string;
  assetType: string;
  environment: string;
  policyUrl: string;
  description: string;
  impact: string;
  reproduceSteps: string[];
  attachments: { name: string; size?: string; type: string }[];
  comments: CommentItem[];
  updates: ActivityUpdate[];
}

// Initial mock dataset for reports matching the prompt specs
const MOCK_REPORTS: ReportItem[] = [
  {
    id: "1",
    reportId: "RPT-2847",
    title: "Broken Access Control on User Profile API",
    program: "Global Enterprise VDP",
    avatarLetter: "B",
    type: "Bounty",
    severity: "HIGH",
    status: "ACCEPTED",
    bountyOrRep: "$1,500.00",
    isBountyHighlight: true,
    lastActivityDate: "Oct 24, 2023",
    lastActivityBadge: "STATUS UPDATE",
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

const MOCK_REPORT_DETAIL: ReportDetail = {
  id: "1",
  reportId: "RPT-2847",
  title: "Broken Access Control on User Profile API",
  program: "Global Enterprise VDP",
  avatarLetter: "B",
  type: "Bounty",
  severity: "HIGH",
  status: "ACCEPTED",
  bountyOrRep: "$1,500.00",
  isBountyHighlight: true,
  lastActivityDate: "Oct 24, 2023",
  lastActivityBadge: "STATUS UPDATE",
  submittedAgo: "Submitted 4 days ago",
  claimedSeverity: "Critical (9.0)",
  confirmedSeverity: "High (8.1)",
  cvssScore: "8.1",
  rewardStatus: "Status: Pending Transfer",
  assetType: "REST API",
  environment: "Production",
  policyUrl: "#",
  description:
    "A vulnerability was discovered in the User Profile API endpoint (/api/v1/profile/[id]) where an authenticated user could access and modify any other user's profile details by simply changing the id parameter. The server fails to validate if the authenticated user owns the resource being requested.",
  impact:
    "This is a classic Insecure Direct Object Reference (IDOR). Attackers could harvest private information for the entire user base, including email addresses, phone numbers, and physical addresses.",
  reproduceSteps: [
    "Log in as user A.",
    "Intercept the request to GET /api/v1/profile/12345 (your ID).",
    "Change the ID to 12346 (user B's ID).",
    "Observe that the full profile details for user B are returned, including PII.",
  ],
  attachments: [{ name: "payload.json", size: "2.4 KB", type: "application/json" }],
  comments: [
    {
      id: "c1",
      author: "hunter_x_ray",
      avatar: "H",
      isAdmin: false,
      timestamp: "Oct 24, 14:32",
      text: "I've attached the proof of concept payload. This works even with standard user privileges. Let menu know if you need more info.",
    },
    {
      id: "c2",
      author: "Alex (SecOps)",
      avatar: "A",
      isAdmin: true,
      timestamp: "Oct 24, 16:15",
      text: "Thanks for the detailed report. We have validated this and our engineering team is working on a fix. This qualifies for our High severity tier.",
    },
  ],
  updates: [
    {
      id: "u1",
      actor: "DevSolve Team",
      actionText: 'changed status to "Accepted"',
      statusBadge: "Accepted",
      timestamp: "Oct 24, 16:10",
    },
  ],
};

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
  }),
});

export const { useGetReportsQuery, useGetReportByIdQuery, useAddReportCommentMutation } = reportsApi;
