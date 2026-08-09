import type {
  ManagedReport,
  MetricCard,
  ReportManagementDetail,
} from "@/components/report-management/types";

export const REPORT_METRICS: MetricCard[] = [
  { title: "Total Report", value: 200 },
  { title: "Pending", value: 20 },
  { title: "Under Review", value: 5 },
  { title: "Approved", value: 78 },
];

export const MANAGED_REPORTS: ManagedReport[] = [
  {
    id: 1,
    title: "TikTok Security Bug Bounty",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "seng@devsolve.io",
    authorInitials: "SS",
    type: "Bounty",
    status: "Open",
    severity: "Critical",
    submittedAt: "Jan 12, 2026",
    summary:
      "Find security vulnerabilities across TikTok's web platform, mobile apps, and creator APIs with a focus on authentication, payment, and media upload flows.",
    assets: ["api.tiktok.com", "Android App"],
  },
  {
    id: 2,
    title: "TikTok Video Moderation Workflow",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "moderation@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "High",
    submittedAt: "Jan 18, 2026",
    summary:
      "Review a vulnerability report tied to internal moderation tooling and evaluate whether the escalation path can be abused outside the trusted staff environment.",
    assets: ["moderation.tiktok.com", "Internal Dashboard"],
  },
  {
    id: 3,
    title: "TikTok Creator Commerce APIs",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "commerce@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Open",
    severity: "Medium",
    submittedAt: "Feb 03, 2026",
    summary:
      "Assess report triage findings for commerce APIs handling creator shop inventory sync, discount code application, and partner account permissions.",
    assets: ["commerce-api.tiktok.com", "Partner Portal"],
  },
  {
    id: 4,
    title: "TikTok Live Stream Session Handling",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "live@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "Low",
    submittedAt: "Feb 14, 2026",
    summary:
      "Validate whether stream session reuse findings can reproduce against current production infrastructure after the identity service patch was deployed.",
    assets: ["live.tiktok.com", "iOS App"],
  },
  {
    id: 5,
    title: "TikTok Ads Manager Partner Access",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "ads@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "High",
    submittedAt: "Mar 02, 2026",
    summary:
      "Investigate a partner-access permission report affecting shared advertiser workspaces, seat management, and billing account role inheritance.",
    assets: ["ads.tiktok.com", "Billing Console"],
  },
  {
    id: 6,
    title: "TikTok Mobile App Token Exchange",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "mobile@devsolve.io",
    authorInitials: "SS",
    type: "Bounty",
    status: "Open",
    severity: "Critical",
    submittedAt: "Mar 17, 2026",
    summary:
      "Prioritize mobile token exchange flaws impacting sign-in refresh flows, device trust signals, and cross-account session persistence on Android.",
    assets: ["Android App", "auth.tiktok.com"],
  },
  {
    id: 7,
    title: "TikTok Creator Studio Draft Uploads",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "studio@devsolve.io",
    authorInitials: "SS",
    type: "Bounty",
    status: "Open",
    severity: "Medium",
    submittedAt: "Apr 04, 2026",
    summary:
      "Investigate whether draft upload endpoints expose unintended asset access through orphaned media references and insufficient ownership checks.",
    assets: ["studio.tiktok.com", "Media Upload API"],
  },
  {
    id: 8,
    title: "TikTok Web Session Cookie Scope",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "web@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "Critical",
    submittedAt: "Apr 22, 2026",
    summary:
      "Confirm remediation of a cookie scope report affecting session isolation between creator, business, and personal account surfaces on web.",
    assets: ["www.tiktok.com", "Creator Center"],
  },
  {
    id: 9,
    title: "TikTok Public API Partner Sandbox",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "sandbox@devsolve.io",
    authorInitials: "SS",
    type: "Bounty",
    status: "Open",
    severity: "High",
    submittedAt: "May 09, 2026",
    summary:
      "Review sandbox escape findings reported through the partner program and verify whether test credentials can pivot into production-linked resources.",
    assets: ["sandbox-api.tiktok.com", "Partner Sandbox"],
  },
  {
    id: 10,
    title: "TikTok Business Center Role Sync",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "business@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "Medium",
    submittedAt: "May 28, 2026",
    summary:
      "Check whether delayed role synchronization could let removed collaborators retain temporary access to finance and campaign administration flows.",
    assets: ["business.tiktok.com", "Role Sync Worker"],
  },
  {
    id: 11,
    title: "TikTok Identity Recovery Workflow",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "identity@devsolve.io",
    authorInitials: "SS",
    type: "Bounty",
    status: "Open",
    severity: "Critical",
    submittedAt: "Jun 11, 2026",
    summary:
      "Examine identity recovery flows involving phone reset, fallback email verification, and MFA downgrade requests for cross-channel abuse.",
    assets: ["identity.tiktok.com", "Recovery Service"],
  },
  {
    id: 12,
    title: "TikTok Shop Merchant API Review",
    programLogo: "/tiktok.png",
    author: "Seng Songhuor",
    authorEmail: "merchant@devsolve.io",
    authorInitials: "SS",
    type: "Response",
    status: "Closed",
    severity: "High",
    submittedAt: "Jul 14, 2026",
    summary:
      "Triage a report about merchant API access boundaries across storefront management, order export, and staff invitation endpoints.",
    assets: ["merchant-api.tiktok.com", "Merchant Portal"],
  },
];

export const REPORT_DETAIL: ReportManagementDetail = {
  id: 1,
  reportId: "RPT-2026-00123",
  title: "TikTok Security Bug Bounty",
  programLogo: "/tiktok.png",
  submitter: "Lor Vengroth",
  submitterInitials: "LV",
  submitterEmail: "lor@devsolve.io",
  type: "Bounty",
  status: "Open",
  severity: "Critical",
  cvssScore: "8.1",
  submittedDate: "Jan 15, 2026",
  bountyRange: "$500 - $14,900, 15 - 60 pts",
  summary:
    "Find security vulnerabilities across TikTok's web platform, mobile apps, and creator APIs. The report focuses on sensitive object access in billing and document retrieval workflows tied to authenticated business accounts.",
  assets: ["*.tiktok.com", "api.tiktok.com", "Android App"],
  affectedUrl: "api.example.com/v1/invoices/1337",
  httpMethod: "GET",
  parameter: "invoice_id",
  environment: "Production",
  environmentNote:
    "This vulnerability was tested against live production servers. Please verify findings with caution.",
  vulnerabilityType: "Insecure Direct Object Reference (IDOR)",
  cweIdentifier: "CWE-639",
  vectorString: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N",
  assessmentSummary:
    "The endpoint /api/v1/invoices/{id} does not properly validate whether the authenticated user has permission to access the requested invoice ID. By iterating through the ID parameter, an attacker can download sensitive billing documents belonging to any other company on the platform.",
  reproductionSteps: [
    "Login to app.example.com as a standard user.",
    "Navigate to the Billing section and view your own invoice, such as ID 1337.",
    "Intercept the request using Burp Suite or a similar testing proxy.",
    "Modify the id parameter to a value not owned by you, such as 1336.",
    "Observe that the server returns the full PDF data and metadata for the unrelated invoice.",
  ],
  impact:
    "Exposure of PII, billing records, and enterprise service usage data for unrelated organizations. The issue introduces high confidentiality risk and can create regulatory exposure across customer accounts.",
  rootCause:
    "The invoice controller trusts the public invoice identifier without enforcing an organization ownership check before resolving the resource from storage.",
  remediation:
    "Introduce a direct authorization policy that validates invoice.organization_id against the authenticated organization context before returning invoice data. Use non-enumerable public identifiers for external document lookups and log authorization failures.",
  analystTip:
    "Tip: Prefer UUID-based public invoice references to reduce trivial enumeration, but still keep a strict server-side ownership check for every request.",
  proofRequestLanguage: "javascript",
  proofRequest: `// Reproduce the invoice enumeration issue with a captured session\nconst params = new URLSearchParams({\n  response_type: "token",\n  client_id: "client_id",\n  redirect_uri: "https://app.example.com/callback",\n  scope: "read:profile",\n});\n\n// Request observed during validation\n// GET https://app.example.com/v1/invoices/1337\n// Modify the invoice identifier to an unowned value such as 1336\n// Observe the returned PDF metadata for another organization`,
  expectedResult: "403 Forbidden / 404 Not Found",
  actualResult: "200 OK (full invoice body returned)",
  attachments: [
    { name: "screenshot_01.png", kind: "image" },
    { name: "burp_log.xml", kind: "file" },
  ],
  externalDocumentation: "Google Drive: Full Reproduction Logs",
  internalAssetLink: "Internal Asset: api.example.com/v1/docs",
  relatedReport: "#RPT-2025-00982 - Similar IDOR in /v1/users",
};

function buildDisplayReportId(report: ManagedReport) {
  if (report.reportId?.trim()) return report.reportId;

  const rawId = String(report.id);
  if (/^\d+$/.test(rawId)) {
    return `RPT-2026-${rawId.padStart(5, "0")}`;
  }

  return `RPT-${rawId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function findManagedReportByRouteId(
  reports: ManagedReport[],
  id: string,
) {
  return reports.find(
    (report) =>
      String(report.id) === id ||
      report.reportId === id ||
      buildDisplayReportId(report) === id,
  );
}

export function buildReportDetailFromManagedReport(
  report: ManagedReport,
): ReportManagementDetail {
  return {
    ...REPORT_DETAIL,
    id: report.id,
    reportId: buildDisplayReportId(report),
    title: report.title,
    programLogo: report.programLogo,
    submitter: report.author,
    submitterInitials: report.authorInitials,
    submitterEmail: report.authorEmail,
    type: report.type,
    status: report.status,
    severity: report.severity,
    submittedDate: report.submittedAt,
    summary: report.summary,
    assets: report.assets,
  };
}

export function getReportDetailById(id: string): ReportManagementDetail {
  const matchedReport = findManagedReportByRouteId(MANAGED_REPORTS, id);

  if (!matchedReport) {
    return REPORT_DETAIL;
  }

  return buildReportDetailFromManagedReport(matchedReport);
}
