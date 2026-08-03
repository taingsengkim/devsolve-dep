export type HacktivityLabel = "NEW" | "UPDATE";
export type HacktivitySeverity = "Critical" | "High" | "Medium" | "Low";

export interface HacktivityActivity {
  id: string;
  initials: string;
  handle: string;
  avatarUrl: string;
  label: HacktivityLabel;
  action: string;
  program: string;
  severity: HacktivitySeverity;
  bounty: string;
  paid: string;
  rep: string;
  timeAgo: string;
}

export interface HacktivityStat {
  label: string;
  value: string;
}

export interface HacktivityFeedResponse {
  stats: HacktivityStat[];
  activities: HacktivityActivity[];
}

export interface HacktivityQueryParams {
  search?: string;
}
