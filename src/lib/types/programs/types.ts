export type EngagementType = "RESPONSE" | "MANAGED" | "BOUNTY" | "DISCOVERY";
export type ProgramState = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "ACTIVE";
export type ProgramType = "All" | "Bounty" | "Response";
export type SubmissionState = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type ProgramVisibility = "PUBLIC" | "PRIVATE";
export type AssetType = "WILDCARD" | "URL" | "CIDR" | "MOBILE" | "OTHER";
export type SeverityLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RuleSection {
  description: string;
  rules: string[];
}

export interface ProgramAsset {
  id?: string;
  assetType?: AssetType;
  identifier: string;
  description?: string;
  isInScope?: boolean;
  maxSeverity?: SeverityLevel;
}

export interface ProgramReward {
  id?: string;
  severity: SeverityLevel;
  minAmount?: number;
  maxAmount?: number;
  points?: number;
}

export interface BountyTier {
  severity: string;
  payoutRange?: string;
  range?: string;
  description?: string;
}

export interface Program {
  id: string;
  organizationId?: string;
  handle?: string;
  name?: string;
  description?: string;
  organizationName?: string;
  companyName?: string;
  companySlug?: string;
  logoUrl?: string;
  logoBgColor?: string;
  title?: string;
  isNew?: boolean;
  isPrivate?: boolean;
  type?: ProgramType | string;
  status?: string;
  engagementType?: EngagementType;
  state?: ProgramState;
  submissionState?: SubmissionState;
  visibility?: ProgramVisibility;
  policy?: string;
  offersBounties?: boolean;
  minimumBounty?: number;
  maximumBounty?: number;
  rewardRange?: string;
  rewardType?: "bounty" | "points";
  totalBountyPaid?: string;
  maxReward?: string;
  researchersCount?: number;
  activeResearchers?: number;
  startDate?: string;
  endDate?: string;
  aboutSummary?: string;
  pocRequirements?: string[];
  inScopeAssets?: (ProgramAsset | string)[];
  assetCategories?: string[];
  inScopeTargets?: string[];
  outOfScopeTargets?: string[];
  rulesExclusions?: string[];
  rulesOfEngagement?: RuleSection | string[];
  exclusions?: RuleSection | string[];
  bountyMatrix?: BountyTier[];
  rewards?: ProgramReward[];
  createdAt?: string;
  updatedAt?: string;
  stats?: {
    reportsSubmitted?: number;
    avgPayout?: string;
    responseTime?: string;
  };
}

export interface ProgramDetail extends Program {
  proofOfConceptRequirements?: string | null;
  rulesOfEngagement?: RuleSection | string[];
  exclusions?: RuleSection | string[];
  assets?: ProgramAsset[];
}

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

export type ProgramItem = Program;

export interface ProgramsCounts {
  all: number;
  bounty: number;
  response: number;
  newCount: number;
  privateCount: number;
}