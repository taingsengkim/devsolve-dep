import { baseApi } from "./baseApi";
import {
  ReportItem,
  ReportsFilterParams,
  ReportDetail,
  CommentItem,
  SubmitReportPayload,
  SubmitReportResponse,
} from "@/lib/types/reports/types";
import type { ManagedReport } from "@/components/report-management/types";
import {
  MOCK_REPORTS,
  MOCK_REPORT_DETAIL,
  MOCK_REJECTED_REPORT_DETAIL,
} from "@/lib/types/reports/mock-data";

export * from "@/lib/types/reports/types";
export * from "@/lib/types/reports/mock-data";

type ApiSeverity = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type ApiState = "NEW" | "TRIAGING" | "NEEDS_MORE_INFO" | "VALID_CONFIRMED" | "RESOLVED" | "REJECTED" | "DUPLICATE";

// Real shape of GET /api/v1/reports/mine content items (per the live OpenAPI
// spec at devsolve-api.quizzy.it.com/v3/api-docs). No program display name is
// included anywhere on this object — only programId — so it's resolved
// separately per report via GET /programs/{id}, same as getHacktivity in
// profileApi.ts.
interface ReportApiResponse {
  id: string;
  programId: string;
  reporterId?: string;
  title: string;
  reportedSeverity?: ApiSeverity;
  triageSeverity?: ApiSeverity;
  severity?: ApiSeverity;
  state: ApiState;
  rewards?: { amount: number }[];
  submittedAt?: string;
  triagedAt?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  reportId?: string;
  reportCode?: string;
  summary?: string;
  impact?: string;
  vulnerabilityInformation?: string;
  assetId?: string;
  assetName?: string;
  assetIdentifier?: string;
  type?: string;
  programType?: string;
  programName?: string;
  authorName?: string;
  authorEmail?: string;
  submitterName?: string;
  submitterEmail?: string;
  researcherName?: string;
  researcherEmail?: string;
  userName?: string;
  reporter?: {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
  };
}

interface ProgramApiResponse {
  id: string;
  name: string;
  engagementType?: string;
  assets?: Array<{
    id?: string;
    identifier?: string;
  }>;
  inScopeAssets?: Array<{
    id?: string;
    identifier?: string;
  }>;
}

interface ReportsEnvelope<T> {
  content?: T[];
  items?: T[];
  data?: T[];
}

// severity/triageSeverity are only set once a report has been triaged, so
// reportedSeverity (the hacker's self-assessment) is the fallback. "NONE"
// has no equivalent in ReportItem's severity union, so it collapses to LOW
// rather than breaking the badge renderer.
function toSeverity(report: ReportApiResponse): ReportItem["severity"] {
  const value = report.severity ?? report.triageSeverity ?? report.reportedSeverity;
  return value === "CRITICAL" || value === "HIGH" || value === "MEDIUM" || value === "LOW" ? value : "LOW";
}

// Backend state enum is more granular than the UI's status union — collapse
// NEEDS_MORE_INFO into TRIAGING (still awaiting the hunter) and DUPLICATE
// into REJECTED (no further action, no reward) since neither has a distinct
// badge in the UI.
function toStatus(state: ApiState): ReportItem["status"] {
  switch (state) {
    case "NEW":
      return "SUBMITTED";
    case "TRIAGING":
    case "NEEDS_MORE_INFO":
      return "TRIAGING";
    case "VALID_CONFIRMED":
      return "ACCEPTED";
    case "RESOLVED":
      return "RESOLVED";
    case "REJECTED":
    case "DUPLICATE":
      return "REJECTED";
  }
}

function toActivityBadge(status: ReportItem["status"]): string {
  switch (status) {
    case "SUBMITTED":
      return "RECEIVED";
    case "TRIAGING":
      return "UNDER TRIAGE";
    case "ACCEPTED":
      return "STATUS UPDATE";
    case "RESOLVED":
      return "PAYMENT ISSUED";
    case "REJECTED":
      return "CLOSURE";
  }
}

function toBountyDisplay(
  report: ReportApiResponse,
  status: ReportItem["status"]
): Pick<ReportItem, "bountyOrRep" | "isBountyHighlight" | "isBountyDim"> {
  const total = report.rewards?.reduce((sum, reward) => sum + (reward.amount ?? 0), 0) ?? 0;
  if (total > 0) return { bountyOrRep: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, isBountyHighlight: true };
  if (status === "REJECTED") return { bountyOrRep: "$0.00", isBountyDim: true };
  if (status === "RESOLVED" || status === "ACCEPTED") return { bountyOrRep: "Reputation" };
  return { bountyOrRep: "Pending Triage" };
}

function toLastActivityDate(report: ReportApiResponse): string {
  const iso = report.updatedAt || report.resolvedAt || report.triagedAt || report.submittedAt || report.createdAt;
  const date = iso ? new Date(iso) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// The backend identifies reports by UUID with no separate human-readable
// report number, so the first 8 hex chars stand in for the old "#DS-2026-101"
// mock format.
function toReportId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

function extractReports(
  response: ReportsEnvelope<ReportApiResponse> | ReportApiResponse[] | undefined,
): ReportApiResponse[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}


// CreateReportRequest (POST /programs/{programId}/reports) only exposes one
// free-text field for the write-up — no dedicated fields for target asset,
// HTTP method, reproduction steps, PoC payload, remediation, etc. — so the
// rest of the multi-step submit-report form is folded into one structured
// write-up here instead of being silently dropped. Attachments have no
// upload endpoint in the spec, so only their metadata is noted as text.
function composeVulnerabilityInformation(payload: SubmitReportPayload): string {
  const sections: string[] = [`## Summary\n${payload.summaryPoC}`];

  const targetLines = [
    `Target: ${payload.targetAsset}`,
    payload.httpMethod ? `HTTP Method: ${payload.httpMethod}` : null,
    payload.vulnerableParameter ? `Vulnerable Parameter: ${payload.vulnerableParameter}` : null,
    payload.environment ? `Environment: ${payload.environment}` : null,
  ].filter((line): line is string => Boolean(line));
  sections.push(`## Target\n${targetLines.join("\n")}`);

  const classificationLines = [
    `Category: ${payload.category}`,
    payload.cweIdentifier ? `CWE: ${payload.cweIdentifier}` : null,
    payload.cvssScore ? `CVSS Score: ${payload.cvssScore}` : null,
    payload.cvssVector ? `CVSS Vector: ${payload.cvssVector}` : null,
  ].filter((line): line is string => Boolean(line));
  sections.push(`## Classification\n${classificationLines.join("\n")}`);

  if (payload.reproduceStepsList?.length) {
    sections.push(`## Steps to Reproduce\n${payload.reproduceStepsList.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  }

  const resultLines = [
    payload.expectedResult ? `Expected: ${payload.expectedResult}` : null,
    payload.actualResult ? `Actual: ${payload.actualResult}` : null,
  ].filter((line): line is string => Boolean(line));
  if (resultLines.length) sections.push(`## Expected vs Actual\n${resultLines.join("\n")}`);

  if (payload.pocPayload) sections.push(`## PoC Payload\n\`\`\`\n${payload.pocPayload}\n\`\`\``);
  if (payload.remediation) sections.push(`## Suggested Remediation\n${payload.remediation}`);
  if (payload.externalLinks?.length) sections.push(`## External Links\n${payload.externalLinks.join("\n")}`);
  if (payload.attachments?.length) {
    sections.push(
      `## Attachments (metadata only — no upload endpoint wired)\n${payload.attachments
        .map((a) => `- ${a.name} (${a.size}, ${a.type})`)
        .join("\n")}`
    );
  }

  return sections.join("\n\n");
}

function toReportItem(report: ReportApiResponse, programName: string): ReportItem {
  const status = toStatus(report.state);
  return {
    id: report.id,
    reportId: toReportId(report.id),
    title: report.title,
    program: programName,
    avatarLetter: programName.slice(0, 1).toUpperCase(),
    type: "Bounty",
    severity: toSeverity(report),
    status,
    ...toBountyDisplay(report, status),
    lastActivityDate: toLastActivityDate(report),
    lastActivityBadge: toActivityBadge(status),
  };
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagedReports: builder.query<ManagedReport[], void>({
      query: () => "/reports/management",
      providesTags: ["Report"],
    }),

    getReports: builder.query<ReportItem[], ReportsFilterParams | void>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const reportsResult = await fetchWithBQ(`/reports/mine?size=100&sort=submittedAt,DESC`);
        if (reportsResult.error) return { error: reportsResult.error };

        const raw = extractReports(
          reportsResult.data as
            | ReportsEnvelope<ReportApiResponse>
            | ReportApiResponse[]
            | undefined,
        );

        const programIds = Array.from(new Set(raw.map((report) => report.programId).filter(Boolean)));
        const programResults = await Promise.all(programIds.map((id) => fetchWithBQ(`/programs/${id}`)));
        const programNames = new Map<string, string>();
        programIds.forEach((id, index) => {
          const result = programResults[index];
          if (!result.error) programNames.set(id, (result.data as ProgramApiResponse).name);
        });

        let results = raw.map((report) => toReportItem(report, programNames.get(report.programId) ?? "Unknown Program"));

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
      async queryFn(payload, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: `/programs/${payload.programId}/reports`,
          method: "POST",
          body: {
            title: payload.title,
            vulnerabilityInformation: composeVulnerabilityInformation(payload),
            impact: payload.impact || undefined,
            // Backend has no "INFO" tier — the closest real equivalent is
            // NONE (see CreateReportRequest.reportedSeverity enum).
            reportedSeverity: payload.severity === "INFO" ? "NONE" : payload.severity,
            assetId: payload.assetId || undefined,
          },
        });
        if (result.error) return { error: result.error };

        const report = result.data as { id: string; submittedAt?: string; createdAt?: string };
        return {
          data: {
            success: true,
            reportId: toReportId(report.id),
            id: report.id,
            message: "Vulnerability report submitted successfully.",
            status: "TRIAGING",
            createdAt: report.submittedAt || report.createdAt || new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ["Report"],
    }),
  }),
});

export const {
  useGetManagedReportsQuery,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useAddReportCommentMutation,
  useSubmitReportMutation,
} = reportsApi;
