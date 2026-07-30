export type LeaderboardBadgeLabel = "Top 10" | "Bug Slayer" | "Speed Hacker" | "First Blood" | "Retest Pro";

export type ResearcherAvatarUrl = string;

export interface Researcher {
  id: string;
  rank: number;
  handle: string; // e.g. "darkp4tch"
  realName: string; // e.g. "Amara Diallo"
  countryCode: string; // e.g. "sn"
  avatarInitials: string;
  avatarUrl?: ResearcherAvatarUrl;
  reputation: number;
  accepted: number;
  critical: number;
  badges: LeaderboardBadgeLabel[];
}

export interface LeaderboardStats {
  activeResearchers: number;
  validReports: number;
  programsLive: number;
}

export type LeaderboardSortMetric = "reputation" | "accepted" | "critical";
