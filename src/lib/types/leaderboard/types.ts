export interface Researcher {
  id: string;
  rank: number;
  name: string;
  handle: string;
  reputation: number;
  reputationDisplay: string;
  accepted: number;
  critical: number;
  badges: string[];
  country?: string;
  avatar?: string;
  joinedDate?: string;
  email?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface LeaderboardStats {
  totalResearchers: number;
  totalReports: number;
  totalPrograms: number;
  topResearcher: string;
  averageReputation: number;
  totalBadges: number;
  activeToday: number;
}

export interface LeaderboardFilters {
  search: string;
  badge: string | null;
  country: string | null;
  minReputation: number | null;
  maxReputation: number | null;
}

export interface LeaderboardResponse {
  researchers: Researcher[];
  stats: LeaderboardStats;
  total: number;
  page: number;
  limit: number;
}