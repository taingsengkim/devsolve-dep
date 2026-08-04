export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend: "up" | "down" | "neutral";
  changeText?: string;
  type: "active_programs" | "total_reports" | "total_bounties" | "valid_reports";
}

export interface ActionQueueItem {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  status: "urgent" | "pending" | "normal";
  linkHref: string;
  type: "triage" | "review" | "retest" | "invite";
}

export interface DashboardProgram {
  id: string;
  name: string;
  companyName: string;
  status: "Open" | "Reviewing" | "Closed" | "Private";
  reportCount: number;
  logoUrl?: string;
  logoBgColor?: string;
}

export interface ReportStatusDistribution {
  resolved: number;
  accepted: number;
  pending: number;
  other: number;
  total: number;
}

export interface ReportSeverityDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface SecurityFeedItem {
  id: string;
  title: string;
  programName: string;
  timestamp: string;
  type: "confirmed" | "resolved" | "joined" | "bounty";
  severity?: "Critical" | "High" | "Medium" | "Low";
}

export interface DashboardOverviewResponse {
  stats: StatMetric[];
  actionQueue: {
    totalCount: number;
    items: ActionQueueItem[];
  };
  myPrograms: DashboardProgram[];
  reportStatus: ReportStatusDistribution;
  reportSeverity: ReportSeverityDistribution;
  securityFeed: SecurityFeedItem[];
}
