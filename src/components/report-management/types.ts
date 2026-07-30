export type ReportType = "Bounty" | "Response";
export type ReportStatus = "Open" | "Closed";
export type ReportSeverity = "Critical" | "High" | "Medium" | "Low";

export type ManagedReport = {
  id: number;
  title: string;
  programLogo?: string;
  author: string;
  authorEmail: string;
  authorInitials: string;
  type: ReportType;
  status: ReportStatus;
  severity: ReportSeverity;
  submittedAt: string;
  summary: string;
  assets: string[];
};

export type ReportManagementDetail = {
  id: number;
  reportId: string;
  title: string;
  programLogo?: string;
  submitter: string;
  submitterInitials: string;
  type: ReportType;
  status: ReportStatus;
  severity: ReportSeverity;
  cvssScore: string;
  submittedDate: string;
  bountyRange: string;
  summary: string;
  assets: string[];
  affectedUrl: string;
  httpMethod: string;
  parameter: string;
  environment: string;
  environmentNote: string;
  vulnerabilityType: string;
  cweIdentifier: string;
  vectorString: string;
  assessmentSummary: string;
  reproductionSteps: string[];
};

export type MetricCard = {
  title: string;
  value: number;
};
