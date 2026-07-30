import { baseApi } from "./baseApi";
import { DashboardOverviewResponse } from "@/lib/types/dashboard/types";

export * from "@/lib/types/dashboard/types";

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverviewResponse = {
  stats: [
    {
      id: "active_programs",
      title: "Active Programs",
      value: "12",
      subtext: "+2 this week",
      trend: "up",
      type: "active_programs",
    },
    {
      id: "total_reports",
      title: "Total Reports",
      value: "1,248",
      subtext: "+156 this month",
      trend: "up",
      type: "total_reports",
    },
    {
      id: "total_bounties",
      title: "Total Bounties",
      value: "$245.5k",
      subtext: "+$32k this month",
      trend: "up",
      type: "total_bounties",
    },
    {
      id: "valid_reports",
      title: "Valid Reports",
      value: "842",
      subtext: "67% acceptance rate",
      trend: "neutral",
      type: "valid_reports",
    },
  ],
  actionQueue: {
    totalCount: 30,
    items: [
      {
        id: "aq_1",
        title: "New reports for triage",
        subtitle: "Pending attention",
        count: 18,
        status: "urgent",
        linkHref: "/dashboard/my-reports?status=TRIAGING",
        type: "triage",
      },
      {
        id: "aq_2",
        title: "Reports in review",
        subtitle: "Pending attention",
        count: 7,
        status: "pending",
        linkHref: "/dashboard/my-reports?status=SUBMITTED",
        type: "review",
      },
      {
        id: "aq_3",
        title: "Retests to request",
        subtitle: "Pending attention",
        count: 3,
        status: "normal",
        linkHref: "/dashboard/my-reports?status=ACCEPTED",
        type: "retest",
      },
      {
        id: "aq_4",
        title: "Pending invites",
        subtitle: "Pending attention",
        count: 2,
        status: "normal",
        linkHref: "/dashboard/programs?quickFilter=private",
        type: "invite",
      },
    ],
  },
  myPrograms: [
    {
      id: "1",
      name: "Vulnerability Disclosure Program",
      companyName: "ACME Corp",
      status: "Open",
      reportCount: 842,
      logoBgColor: "bg-blue-600",
    },
    {
      id: "2",
      name: "Secure Payments API",
      companyName: "PayTech Global",
      status: "Open",
      reportCount: 41,
      logoBgColor: "bg-emerald-600",
    },
    {
      id: "3",
      name: "Legacy Web Portal",
      companyName: "DevSolve Security",
      status: "Reviewing",
      reportCount: 12,
      logoBgColor: "bg-amber-500",
    },
  ],
  reportStatus: {
    resolved: 531,
    accepted: 236,
    pending: 289,
    other: 192,
    total: 1248,
  },
  reportSeverity: {
    critical: 42,
    high: 118,
    medium: 287,
    low: 395,
    total: 842,
  },
  securityFeed: [
    {
      id: "feed_1",
      title: "Critical report confirmed by admin for ACME Web Bounty",
      programName: "ACME Web Bounty",
      timestamp: "2h ago",
      type: "confirmed",
      severity: "Critical",
    },
    {
      id: "feed_2",
      title: "Report #45 confirmed by admin for Secure Payments API",
      programName: "Secure Payments API",
      timestamp: "4h ago",
      type: "confirmed",
      severity: "High",
    },
    {
      id: "feed_3",
      title: "New researcher joined ACME Infrastructure — Private",
      programName: "ACME Infrastructure",
      timestamp: "6h ago",
      type: "joined",
    },
    {
      id: "feed_4",
      title: "Bounty payout of $2,500 awarded for SQL Injection report",
      programName: "Secure Payments API",
      timestamp: "1d ago",
      type: "bounty",
      severity: "Critical",
    },
  ],
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      queryFn: () => {
        return { data: MOCK_DASHBOARD_OVERVIEW };
      },
      providesTags: ["Report", "Program"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
