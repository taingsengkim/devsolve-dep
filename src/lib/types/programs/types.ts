export type ProgramType = "Bounty" | "Response";
export type ProgramStatus = "Open" | "Done" | "Archived";
export type AssetCategory = "Web" | "API" | "Mobile" | "Network";

export interface BountyTier {
  severity: "Critical" | "High" | "Medium" | "Low";
  payoutRange: string;
}

export interface ProgramItem {
  id: string;
  companyName: string;
  companySlug: string;
  logoUrl?: string;
  logoBgColor?: string;
  type: ProgramType;
  status: ProgramStatus;
  isNew?: boolean;
  isPrivate?: boolean;
  title: string;
  description: string;
  inScopeAssets: string[];
  assetCategories: AssetCategory[];
  rewardRange: string;
  rewardType: "bounty" | "points";
  totalBountyPaid?: string;
  maxReward?: string;
  researchersCount?: number;
  startDate?: string;
  endDate?: string;
  aboutSummary?: string;
  pocRequirements?: string[];
  rulesExclusions?: string[];
  bountyMatrix?: { severity: string; range: string; description: string }[];
  stats?: {
    reportsSubmitted?: number;
    avgPayout?: string;
    responseTime?: string;
  };


// Extended fields for detail page
  startDate?: string;
  endDate?: string;
  activeResearchers?: number;
  pocRequirements?: string[];
  inScopeTargets?: string[];
  outOfScopeTargets?: string[];
  bountyMatrix?: BountyTier[];
  rulesOfEngagement?: string[];
  exclusions?: string[];
  


}

export interface ProgramsFilterParams {
  search?: string;
  type?: "All" | ProgramType;
  category?: "All" | AssetCategory;
  status?: "All" | ProgramStatus;
  quickFilter?: "all" | "bounty" | "response" | "new" | "private";
  page?: number;
  limit?: number;
}

export interface ProgramsCounts {
  all: number;
  bounty: number;
  response: number;
  newCount: number;
  privateCount: number;
}

export interface ProgramsResponse {
  data: ProgramItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: ProgramsCounts;
}
