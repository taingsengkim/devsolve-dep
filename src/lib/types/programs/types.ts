export type EngagementType = "RESPONSE" | "BOUNTY";
export type ProgramState = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "ACTIVE";
export type ProgramType = "All" | "Bounty" | "Response";
export type SubmissionState = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type ProgramVisibility = "PUBLIC" | "PRIVATE";
export type AssetType =
  | "URL"
  | "WILDCARD"
  | "IP_RANGE"
  | "MOBILE_APP"
  | "API"
  | "SOURCE_CODE"
  | "HARDWARE"
  | "OTHER";
export type SeverityLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// 1. NEW INTERFACES FOR RULES & EXCLUSIONS
export interface RuleSection {
  description: string;
  rules: string[];
}

export interface ProgramAsset {
  id: string;
  assetType: AssetType;
  identifier: string;
  description: string;
  isInScope: boolean;
  maxSeverity: SeverityLevel;
}

export interface ProgramReward {
  id: string;
  severity: SeverityLevel;
  minAmount: number;
  maxAmount: number;
  points: number;
}

export interface Asset {
  assetType: AssetType;
  identifier: string;
  description: string;
  isInScope: boolean;
  maxSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
}

export interface RewardTier {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  minAmount: number;
  maxAmount: number;
  points: number;
}

export interface CreateProgramRequest {
  handle: string;
  name: string;
  description: string;
  engagementType: "BOUNTY" | "RESPONSE";
  visibility: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  policy: string;
  proofOfConceptRequirements: string;
  rulesOfEngagement: RuleSection;
  exclusions: RuleSection;
  offersBounties: boolean;
  minimumBounty: number;
  maximumBounty: number;
  assets: Asset[];
  rewards: RewardTier[];
}

export interface Program {
  id: string;
  organizationId: string;
  handle: string;
  name: string;
  description: string;
  organizationName: string;
  engagementType: EngagementType;
  state: ProgramState;
  submissionState: SubmissionState;
  visibility: ProgramVisibility;
  policy: string;
  offersBounties: boolean;
  minimumBounty: number;
  maximumBounty: number;
  inScopeAssets: ProgramAsset[];
  rewards: ProgramReward[];
  createdAt: string;
  updatedAt: string;
}

// 2. UPDATED PROGRAM DETAIL
export interface ProgramDetail {
  id: string;
  organizationId: string;
  handle: string;
  name: string;
  description: string;
  organizationName: string;
  engagementType: EngagementType;
  state: ProgramState;
  submissionState: SubmissionState;
  visibility: ProgramVisibility;
  policy: string;
  offersBounties: boolean;
  proofOfConceptRequirements?: string | null;
  minimumBounty: number;
  maximumBounty: number;
  rejectionReason?: string | null;

  // Added Rules & Exclusions fields
  rulesOfEngagement?: RuleSection;
  exclusions?: RuleSection;

  assets: ProgramAsset[];
  inScopeAssets?: ProgramAsset[];
  rewards: ProgramReward[];
  createdAt: string;
  updatedAt: string;
}

// Spring Data Paginated Response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetProgramsParams {
  page?: number;
  size?: number;
  search?: string;
  engagementType?: string;
  state?: string;
}

export type AssetCategory =
  | "Web"
  | "API"
  | "Mobile"
  | "Network"
  | "Other"
  | string;
export type ProgramStatus = "Open" | "Done" | "Closed" | string;

export interface ProgramsCounts {
  all: number;
  bounty: number;
  response: number;
  newCount: number;
  privateCount: number;
}

export interface ProgramItemStats {
  reportsSubmitted?: number;
  avgPayout?: string;
  responseTime?: string;
}

export interface ProgramBountyMatrixItem {
  severity: string;
  payoutRange?: string;
  range?: string;
  description?: string;
}

export interface ProgramItem {
  id: string;
  companyName: string;
  companySlug: string;
  logoUrl: string;
  logoBgColor?: string;
  type: "Bounty" | "Response";
  status: "Open" | "Done" | "Closed" | string;
  isNew?: boolean;
  isPrivate?: boolean;
  title: string;
  description: string;
  inScopeAssets: string[];
  assetCategories?: string[];
  rewardRange: string;
  rewardType?: "bounty" | "points" | string;
  maxReward?: string;
  totalBountyPaid?: string;
  researchersCount?: number;
  activeResearchers?: number;
  startDate?: string;
  endDate?: string;
  aboutSummary?: string;
  pocRequirements?: string[];
  rulesExclusions?: string[];
  rulesOfEngagement?: string[];
  exclusions?: string[];
  inScopeTargets?: string[];
  outOfScopeTargets?: string[];
  bountyMatrix?: ProgramBountyMatrixItem[];
  stats?: ProgramItemStats;
}
