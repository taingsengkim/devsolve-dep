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

export interface RetestItem {
  id: string;
  reportIdTitle: string;
  securityCategory: string;
  version: string;
  status: "PASSED" | "FAILED";
  requestDate: string;
  bountyBonus?: string;
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
  retestHistory: RetestItem[];
}
