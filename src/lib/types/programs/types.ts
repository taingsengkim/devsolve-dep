export type ProgramType = "Bounty" | "Response";
export type ProgramStatus = "Open" | "Done" | "Archived";
export type AssetCategory = "Web" | "API" | "Mobile" | "Network";

export interface BountyTier {
  severity: string;
  payoutRange?: string;
  range?: string;
  description?: string;
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
  bountyMatrix?: BountyTier[];
  stats?: {
    reportsSubmitted?: number;
    avgPayout?: string;
    responseTime?: string;
  };

  // Extended fields for detail page
  activeResearchers?: number;
  inScopeTargets?: string[];
  outOfScopeTargets?: string[];
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
