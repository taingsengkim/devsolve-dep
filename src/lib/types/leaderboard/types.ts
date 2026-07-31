export type LeaderboardBadgeLabel = "Top 10" | "Bug Slayer" | "Speed Hacker" | "First Blood" | "Retest Pro";

export type ResearcherAvatarUrl = string;

export interface ResearcherAchievement {
  id: string;
  level: number;
  label: string;
  value: number; // e.g. 05, 30, 60, 15
  color: string;
}

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
  level: number;
  trend: { direction: "up" | "down" | "neutral", value: number };
  categories: string[];
  achievements: ResearcherAchievement[];
  levelProgress: number; // 0-100
}

export interface LeaderboardStats {
  activeResearchers: number;
  validReports: number;
  programsLive: number;
}

export type LeaderboardSortMetric = "reputation" | "accepted" | "critical";
