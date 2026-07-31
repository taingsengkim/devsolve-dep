import { baseApi } from "./baseApi";
import {
  AdminDashboardOverviewResponse,
  CompanyVerificationItem,
  ReportConfirmationItem,
  AdminUserItem,
  ModerationItem,
  ContentReportItem,
  ReportReasonsBreakdownData,
} from "@/lib/types/admin/types";

export * from "@/lib/types/admin/types";

export const MOCK_ADMIN_OVERVIEW: AdminDashboardOverviewResponse = {
  stats: [
    {
      id: "stat_orgs",
      title: "Organizations",
      value: "214",
      subtext: "12 pending KYC",
      type: "organizations",
    },
    {
      id: "stat_programs",
      title: "Programs",
      value: "389",
      subtext: "34 active bounties",
      type: "programs",
    },
    {
      id: "stat_reports",
      title: "Total Reports",
      value: "1,847",
      subtext: "128 awaiting review",
      type: "total_reports",
    },
    {
      id: "stat_users",
      title: "Users",
      value: "5,203",
      subtext: "1,204 active this week",
      type: "users",
    },
    {
      id: "stat_posts",
      title: "Community Posts",
      value: "3,612",
      subtext: "4 pending approval",
      type: "community_posts",
    },
    {
      id: "stat_disputes",
      title: "Open Disputes",
      value: "23",
      subtext: "3 unresolved > 7d",
      type: "disputes",
    },
  ],
  activityChart: [
    { month: "Jan", reports: 42, communityPosts: 42, disputes: 40 },
    { month: "Feb", reports: 58, communityPosts: 58, disputes: 58 },
    { month: "Mar", reports: 50, communityPosts: 50, disputes: 50 },
    { month: "Apr", reports: 72, communityPosts: 72, disputes: 70 },
    { month: "May", reports: 88, communityPosts: 88, disputes: 86 },
    { month: "Jun", reports: 96, communityPosts: 96, disputes: 96 },
    { month: "Jul", reports: 116, communityPosts: 116, disputes: 114 },
  ],
  reportStatusBreakdown: {
    confirmed: 341,
    pending: 128,
    rejected: 87,
    inReview: 54,
    total: 610,
  },
  actionQueue: {
    totalCount: 26,
    items: [
      {
        id: "aq_admin_1",
        title: "Company Verifications Pending",
        subtitle: "KYB & Domain Audit",
        count: 12,
        status: "urgent",
        linkHref: "/dashboard/company-verification",
        type: "verification",
      },
      {
        id: "aq_admin_2",
        title: "Critical Reports for Admin Review",
        subtitle: "Pre-company Triage Validation",
        count: 8,
        status: "urgent",
        linkHref: "/dashboard/report-confirmation",
        type: "report_confirmation",
      },
      {
        id: "aq_admin_3",
        title: "Community Moderation Queue",
        subtitle: "Flagged Posts & Discussions",
        count: 4,
        status: "pending",
        linkHref: "/dashboard/community-moderation",
        type: "moderation",
      },
      {
        id: "aq_admin_4",
        title: "Pending User Access Requests",
        subtitle: "Role Elevation Reviews",
        count: 2,
        status: "normal",
        linkHref: "/dashboard/users",
        type: "user_review",
      },
    ],
  },
  recentActivity: [
    {
      id: "act_1",
      title: "Company 'CyberArmor Inc.' verification document approved",
      actor: "Admin Alex",
      timestamp: "10m ago",
      type: "verification",
      badgeText: "Approved",
    },
    {
      id: "act_2",
      title: "Report #1042 (Critical RCE) confirmed and routed to PayTech",
      actor: "Admin Sarah",
      timestamp: "45m ago",
      type: "user_action",
      badgeText: "Report Confirmed",
    },
    {
      id: "act_3",
      title: "$12,500 bounty payout approved for ACME Corp VDP",
      actor: "Admin System",
      timestamp: "2h ago",
      type: "bounty",
      badgeText: "Payout Sent",
    },
    {
      id: "act_4",
      title: "Flagged community post #892 removed for policy breach",
      actor: "Mod Dave",
      timestamp: "3h ago",
      type: "system",
      badgeText: "Moderated",
    },
  ],
};

export const MOCK_COMPANY_VERIFICATIONS: CompanyVerificationItem[] = [
  {
    id: "comp_1",
    orgCode: "ORG-2025-001",
    companyName: "Acme Corporation",
    email: "james.chen@acme.com",
    domain: "acme.com",
    taxId: "TAX-9948201",
    businessType: "Technology / Software",
    registrationDate: "2025-07-08",
    submittedAt: "Jul 8, 2025, 04:14 PM",
    status: "PENDING",
    documentsCount: 3,
    notes: "Submitted Certificate of Incorporation & Tax Certificate.",
    contactName: "James Chen",
    jobTitle: "CISO",
    phone: "+1 415 234 5678",
    website: "https://acme.com",
    country: "United States",
    industry: "Technology / Software",
    description: "Acme Corporation is a leading software platform serving 12M+ users globally. We are committed to proactive security and want to run a public bug bounty program to identify vulnerabilities before they become incidents.",
    logoUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=128&auto=format&fit=crop&q=80",
    riskIndicators: {
      domainMatchesEmail: true,
      noFailedDocs: true,
      descriptionProvided: true,
    },
  },
  {
    id: "comp_2",
    orgCode: "ORG-2025-002",
    companyName: "Nexus Financial Solutions",
    email: "security@nexusfin.com",
    domain: "nexusfin.com",
    taxId: "TAX-4481923",
    businessType: "FinTech Platform",
    registrationDate: "2026-07-28",
    submittedAt: "Jul 28, 2026, 11:30 AM",
    status: "PENDING",
    documentsCount: 3,
    notes: "Submitted Certificate of Incorporation & Tax Certificate.",
    contactName: "Sarah Jenkins",
    jobTitle: "Head of Security",
    phone: "+1 212 555 0192",
    website: "https://nexusfin.com",
    country: "United States",
    industry: "FinTech / Banking",
    description: "Nexus Financial Solutions powers next-gen payment gateways and digital asset custody for over 500 enterprise institutions.",
    logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80",
    riskIndicators: {
      domainMatchesEmail: true,
      noFailedDocs: true,
      descriptionProvided: true,
    },
  },
  {
    id: "comp_3",
    orgCode: "ORG-2025-003",
    companyName: "CloudPulse Systems",
    email: "admin@cloudpulse.io",
    domain: "cloudpulse.io",
    taxId: "TAX-1129481",
    businessType: "Cloud Infrastructure",
    registrationDate: "2026-07-27",
    submittedAt: "Jul 27, 2026, 09:15 AM",
    status: "APPROVED",
    documentsCount: 4,
    notes: "Fully verified KYB and active VDP host.",
    contactName: "Alex Rivera",
    jobTitle: "VP of Engineering",
    phone: "+1 415 888 2049",
    website: "https://cloudpulse.io",
    country: "Canada",
    industry: "Cloud Infrastructure",
    description: "CloudPulse Systems delivers edge computing infrastructure, microservice orchestration, and serverless runtime platforms.",
    logoUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80",
    riskIndicators: {
      domainMatchesEmail: true,
      noFailedDocs: true,
      descriptionProvided: true,
    },
  },
  {
    id: "comp_4",
    orgCode: "ORG-2025-004",
    companyName: "Shadow Crypto Protocol",
    email: "contact@shadowcrypto.fake",
    domain: "shadowcrypto.fake",
    taxId: "TAX-0000000",
    businessType: "DeFi",
    registrationDate: "2026-07-24",
    submittedAt: "Jul 24, 2026, 02:00 PM",
    status: "REJECTED",
    documentsCount: 1,
    notes: "Invalid business registration document.",
    contactName: "Unknown Registrant",
    jobTitle: "Founder",
    phone: "+1 000 000 0000",
    website: "https://shadowcrypto.fake",
    country: "Unknown",
    industry: "DeFi",
    description: "Decentralized liquidity pool aggregator protocol.",
    logoUrl: "",
    riskIndicators: {
      domainMatchesEmail: false,
      noFailedDocs: false,
      descriptionProvided: false,
    },
  },
];

export const MOCK_REPORT_CONFIRMATIONS: ReportConfirmationItem[] = [
  {
    id: "rep_conf_1",
    title: "SQL Injection in Authentication API Endpoint",
    researcherName: "alex_sec",
    companyName: "Nexus Financial",
    severity: "Critical",
    status: "PENDING",
    submittedAt: "1h ago",
    rewardEstimate: "$3,500 - $5,000",
    category: "Web Vulnerability",
  },
  {
    id: "rep_conf_2",
    title: "Unauthenticated Remote Code Execution in Image Processor",
    researcherName: "bug_hunter_pro",
    companyName: "CloudPulse Systems",
    severity: "Critical",
    status: "PENDING",
    submittedAt: "3h ago",
    rewardEstimate: "$7,500 - $10,000",
    category: "Infrastructure",
  },
  {
    id: "rep_conf_3",
    title: "IDOR allowing unauthorized user profile access",
    researcherName: "byte_wizard",
    companyName: "BioHealth Global",
    severity: "High",
    status: "CONFIRMED",
    submittedAt: "1d ago",
    rewardEstimate: "$1,200",
    category: "Access Control",
  },
  {
    id: "rep_conf_4",
    title: "Reflected XSS on search query parameter",
    researcherName: "shadow_coder",
    companyName: "ACME Corp",
    severity: "Medium",
    status: "PENDING",
    submittedAt: "5h ago",
    rewardEstimate: "$400",
    category: "XSS",
  },
];

export const MOCK_ADMIN_USERS: AdminUserItem[] = [
  {
    id: "usr_1",
    name: "Alex Rivera",
    email: "alex.rivera@devsolve.com",
    role: "ADMIN",
    status: "ACTIVE",
    joinedDate: "2025-01-10",
  },
  {
    id: "usr_2",
    name: "Sarah Chen",
    email: "sarah@nexusfin.com",
    role: "COMPANY",
    status: "ACTIVE",
    joinedDate: "2026-02-14",
    programsManaged: 3,
  },
  {
    id: "usr_3",
    name: "Marcus Vance",
    email: "marcus_vance@sec.io",
    role: "USER",
    status: "ACTIVE",
    joinedDate: "2026-03-01",
    reportsSubmitted: 28,
  },
  {
    id: "usr_4",
    name: "Spammy Bot",
    email: "bot99281@tempmail.org",
    role: "USER",
    status: "SUSPENDED",
    joinedDate: "2026-07-20",
    reportsSubmitted: 0,
  },
  {
    id: "usr_5",
    name: "David Kim",
    email: "david.kim@devsolve.com",
    role: "MODERATOR",
    status: "ACTIVE",
    joinedDate: "2025-06-15",
  },
  {
    id: "usr_6",
    name: "Priya Patel",
    email: "priya.patel@cyberarm.io",
    role: "COMPANY",
    status: "ACTIVE",
    joinedDate: "2026-04-22",
    programsManaged: 7,
  },
  {
    id: "usr_7",
    name: "Jordan Blake",
    email: "j.blake@sec-research.dev",
    role: "USER",
    status: "ACTIVE",
    joinedDate: "2026-01-05",
    reportsSubmitted: 54,
  },
  {
    id: "usr_8",
    name: "Elena Sokolova",
    email: "elena@devsolve.com",
    role: "MODERATOR",
    status: "ACTIVE",
    joinedDate: "2025-11-03",
  },
  {
    id: "usr_9",
    name: "Thomas Webb",
    email: "t.webb@bugbounty.pro",
    role: "USER",
    status: "SUSPENDED",
    joinedDate: "2026-06-18",
    reportsSubmitted: 2,
  },
  {
    id: "usr_10",
    name: "CloudPulse Admin",
    email: "admin@cloudpulse.io",
    role: "COMPANY",
    status: "ACTIVE",
    joinedDate: "2026-07-27",
    programsManaged: 4,
  },
  {
    id: "usr_11",
    name: "New Researcher",
    email: "new.user@example.com",
    role: "USER",
    status: "PENDING",
    joinedDate: "2026-07-31",
    reportsSubmitted: 0,
  },
];

export const MOCK_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: "mod_1",
    contentType: "DISCUSSION",
    title: "Leaked zero-day exploit disclosure without verification",
    authorName: "dark_coder_99",
    reason: "Policy Violation",
    reportedAt: "2h ago",
    status: "PENDING",
    details: "Post contains unverified zero-day exploit code targeting active member VDP.",
  },
  {
    id: "mod_2",
    contentType: "COMMENT",
    title: "Abusive language in report feedback section",
    authorName: "angry_user_44",
    reason: "Harassment",
    reportedAt: "5h ago",
    status: "PENDING",
    details: "User engaged in toxic comments towards company triage engineer.",
  },
  {
    id: "mod_3",
    contentType: "SHOWCASE",
    title: "Promotional spam link insertion in security article",
    authorName: "seo_spammer",
    reason: "Spam",
    reportedAt: "1d ago",
    status: "PENDING",
    details: "Article contains automated affiliate links to unverified crypto wallet.",
  },
];

export const MOCK_CONTENT_REPORTS: ContentReportItem[] = [
  {
    id: "cr_1",
    type: "SOLUTION",
    title: '"Buy cheap followers here — best price guaranteed..."',
    timestamp: "1 day ago",
    reportCount: 8,
    reason: "Spam",
    author: "spammer_x",
    pastViolationsCount: 3,
    status: "PENDING",
  },
  {
    id: "cr_2",
    type: "PROBLEM",
    title: '"How to hack my ex\'s Instagram account..."',
    timestamp: "3 day ago",
    reportCount: 12,
    reason: "Harmful",
    author: "anon_44",
    status: "PENDING",
  },
  {
    id: "cr_3",
    type: "COMMENT",
    title: '"This is completely wrong, you clearly have no idea..."',
    timestamp: "4 day ago",
    reportCount: 3,
    reason: "Offensive",
    author: "rude_user",
    status: "PENDING",
  },
  {
    id: "cr_4",
    type: "PROGRAM",
    title: '"Test our website"',
    timestamp: "8 day ago",
    reportCount: 1,
    reason: "Off-topic",
    author: "FakeCorp",
    pastViolationsCount: 2,
    status: "PENDING",
  },
];

export const MOCK_REPORT_REASONS_BREAKDOWN: ReportReasonsBreakdownData = {
  spam: 6,
  harmful: 3,
  offensive: 3,
  offTopic: 2,
  total: 14,
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminDashboardOverviewResponse, void>({
      queryFn: () => {
        return { data: MOCK_ADMIN_OVERVIEW };
      },
      providesTags: ["Report", "Program"],
    }),
    getCompanyVerifications: builder.query<CompanyVerificationItem[], void>({
      queryFn: () => {
        return { data: MOCK_COMPANY_VERIFICATIONS };
      },
      providesTags: ["CompanyVerification"],
    }),
    getCompanyVerificationById: builder.query<CompanyVerificationItem, string>({
      queryFn: (id) => {
        const found = MOCK_COMPANY_VERIFICATIONS.find((c) => c.id === id);
        if (found) return { data: found };
        return { data: MOCK_COMPANY_VERIFICATIONS[0] };
      },
      providesTags: (_result, _error, id) => [{ type: "CompanyVerification", id }],
    }),
    updateCompanyVerificationStatus: builder.mutation<
      CompanyVerificationItem,
      { id: string; status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; notes?: string }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status, notes }) => {
        const item = MOCK_COMPANY_VERIFICATIONS.find((c) => c.id === id);
        if (item) {
          item.status = status;
          if (notes) item.notes = notes;
        }
        return { data: item || MOCK_COMPANY_VERIFICATIONS[0] };
      },
      invalidatesTags: ["CompanyVerification"],
    }),
    getReportConfirmations: builder.query<ReportConfirmationItem[], void>({
      queryFn: () => {
        return { data: MOCK_REPORT_CONFIRMATIONS };
      },
    }),
    updateConfirmReport: builder.mutation<
      ReportConfirmationItem,
      { id: string; status: "CONFIRMED" | "REJECTED" | "ESCALATED" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status }) => {
        const item = MOCK_REPORT_CONFIRMATIONS.find((r) => r.id === id);
        if (item) {
          item.status = status;
        }
        return { data: item || MOCK_REPORT_CONFIRMATIONS[0] };
      },
      invalidatesTags: ["Report"],
    }),
    getAdminUsers: builder.query<AdminUserItem[], void>({
      queryFn: () => {
        return { data: MOCK_ADMIN_USERS };
      },
    }),
    updateAdminUserStatus: builder.mutation<
      AdminUserItem,
      { id: string; status: "ACTIVE" | "SUSPENDED"; role?: "USER" | "COMPANY" | "ADMIN" | "MODERATOR" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status, role }) => {
        const item = MOCK_ADMIN_USERS.find((u) => u.id === id);
        if (item) {
          item.status = status;
          if (role) item.role = role;
        }
        return { data: item || MOCK_ADMIN_USERS[0] };
      },
      invalidatesTags: ["AdminUser"],
    }),
    getModerationItems: builder.query<ModerationItem[], void>({
      queryFn: () => {
        return { data: MOCK_MODERATION_ITEMS };
      },
    }),
    updateModerationItem: builder.mutation<
      ModerationItem,
      { id: string; status: "RESOLVED" | "DISMISSED" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status }) => {
        const item = MOCK_MODERATION_ITEMS.find((m) => m.id === id);
        if (item) {
          item.status = status;
        }
        return { data: item || MOCK_MODERATION_ITEMS[0] };
      },
      invalidatesTags: ["ModerationItem"],
    }),
    getContentReports: builder.query<
      { items: ContentReportItem[]; breakdown: ReportReasonsBreakdownData },
      void
    >({
      queryFn: () => {
        return {
          data: {
            items: MOCK_CONTENT_REPORTS,
            breakdown: MOCK_REPORT_REASONS_BREAKDOWN,
          },
        };
      },
    }),
    updateContentReportAction: builder.mutation<
      ContentReportItem,
      { id: string; action: "DISMISS" | "WARN" | "REMOVE" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, action }) => {
        const item = MOCK_CONTENT_REPORTS.find((r) => r.id === id);
        if (item) {
          if (action === "DISMISS") item.status = "DISMISSED";
          if (action === "WARN") item.status = "WARNED";
          if (action === "REMOVE") item.status = "REMOVED";
        }
        return { data: item || MOCK_CONTENT_REPORTS[0] };
      },
      invalidatesTags: ["ContentReport"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetCompanyVerificationsQuery,
  useGetCompanyVerificationByIdQuery,
  useUpdateCompanyVerificationStatusMutation,
  useGetReportConfirmationsQuery,
  useUpdateConfirmReportMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  useGetModerationItemsQuery,
  useUpdateModerationItemMutation,
  useGetContentReportsQuery,
  useUpdateContentReportActionMutation,
} = adminApi;
