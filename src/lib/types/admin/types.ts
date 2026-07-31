export interface AdminStatMetric {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend?: "up" | "down" | "neutral";
  changeText?: string;
  type: "organizations" | "programs" | "total_reports" | "users" | "community_posts" | "disputes";
}

export interface AdminActionQueueItem {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  status: "urgent" | "pending" | "normal";
  linkHref: string;
  type: "verification" | "report_confirmation" | "moderation" | "user_review";
}

export interface PlatformActivityPoint {
  month: string;
  reports: number;
  communityPosts: number;
  disputes: number;
}

export interface ReportStatusBreakdown {
  confirmed: number;
  pending: number;
  rejected: number;
  inReview: number;
  total: number;
}

export interface CompanyVerificationItem {
  id: string;
  orgCode?: string;
  companyName: string;
  email: string;
  domain: string;
  taxId: string;
  businessType: string;
  registrationDate: string;
  submittedAt?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  documentsCount: number;
  notes?: string;
  contactName?: string;
  jobTitle?: string;
  phone?: string;
  website?: string;
  country?: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
  riskIndicators?: {
    domainMatchesEmail: boolean;
    noFailedDocs: boolean;
    descriptionProvided: boolean;
  };
}

export interface ReportConfirmationItem {
  id: string;
  title: string;
  researcherName: string;
  companyName: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "ESCALATED";
  submittedAt: string;
  rewardEstimate: string;
  category: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "USER" | "COMPANY" | "ADMIN" | "MODERATOR";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  joinedDate: string;
  reportsSubmitted?: number;
  programsManaged?: number;
  avatarUrl?: string;
}

export interface ModerationItem {
  id: string;
  contentType: "DISCUSSION" | "SHOWCASE" | "COMMENT" | "PROFILE";
  title: string;
  authorName: string;
  reason: "Spam" | "Harassment" | "Inappropriate Content" | "Policy Violation";
  reportedAt: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  details: string;
}

export interface ContentReportItem {
  id: string;
  type: "SOLUTION" | "PROBLEM" | "COMMENT" | "PROGRAM";
  title: string;
  timestamp: string;
  reportCount: number;
  reason: "Spam" | "Harmful" | "Offensive" | "Off-topic";
  author: string;
  pastViolationsCount?: number;
  status: "PENDING" | "DISMISSED" | "WARNED" | "REMOVED";
}

export interface ReportReasonsBreakdownData {
  spam: number;
  harmful: number;
  offensive: number;
  offTopic: number;
  total: number;
}

export interface AdminActivityFeedItem {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  type: "verification" | "bounty" | "user_action" | "system";
  badgeText: string;
}

export interface AdminDashboardOverviewResponse {
  stats: AdminStatMetric[];
  activityChart: PlatformActivityPoint[];
  reportStatusBreakdown: ReportStatusBreakdown;
  actionQueue: {
    totalCount: number;
    items: AdminActionQueueItem[];
  };
  recentActivity: AdminActivityFeedItem[];
}
