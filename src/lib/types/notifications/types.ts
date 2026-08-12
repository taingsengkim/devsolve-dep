export interface NotificationActor {
  name: string;
  avatar?: string;
}

export interface NotificationBadge {
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  iconType?: "incident" | "question" | "bug";
}

export interface NotificationTarget {
  id?: string;
  title: string;
  href?: string;
  type?: "ticket" | "knowledgebase" | "discussion" | "report";
  badge?: NotificationBadge;
}

export interface QuickReply {
  id: string;
  author: string;
  avatar?: string;
  message: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  actor: NotificationActor;
  action: string;
  target?: NotificationTarget;
  contentSnippet?: string;
  timestamp: string;
  dateGroup: string; // e.g. "7 March 2023", "6 March 2023"
  isUnread: boolean;
  hasActiveBorder?: boolean;
  canReply?: boolean;
  replies?: QuickReply[];
}

export interface NotificationFilter {
  dateAdded?: string;
  unreadOnly?: boolean;
}

export interface MarkAsReadRequest {
  notificationId?: string; // If omitted, mark all as read
}

export interface ReplyNotificationRequest {
  notificationId: string;
  message: string;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  unreadCount: number;
}

export type NotificationChannel = "inApp" | "email" | "push";

export interface NotificationChannelOptions {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export type NotificationCategoryKey =
  | "reportStatusChanges"
  | "retestInvites"
  | "bountyPayouts"
  | "newPrograms"
  | "scopeUpdates"
  | "privateInvites"
  | "discussionReplies"
  | "solutionApprovals"
  | "followerActivity"
  | "securityAlerts"
  | "passwordChanges";

export type NotificationFrequency =
  | "IMMEDIATE"
  | "DAILY_DIGEST"
  | "WEEKLY_SUMMARY"
  | "OFF";

export interface NotificationCategoryConfig {
  key: NotificationCategoryKey;
  label: string;
  description: string;
  section: "security" | "reports" | "programs" | "community";
}

export interface NotificationSettingsPreferences {
  masterEnabled: boolean;
  digestFrequency: NotificationFrequency;
  categories: Record<NotificationCategoryKey, NotificationChannelOptions>;
}

export interface UpdateNotificationSettingsRequest {
  masterEnabled?: boolean;
  digestFrequency?: NotificationFrequency;
  categories?: Partial<Record<NotificationCategoryKey, Partial<NotificationChannelOptions>>>;
}


